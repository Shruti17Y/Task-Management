const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { sendRealtimeNotification } = require('../services/notificationService');

const notifyUser = async (userId, action, task, oldTask = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      action,
      taskDetails: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      },
      oldTaskDetails: oldTask ? {
        title: oldTask.title,
        description: oldTask.description,
        status: oldTask.status,
        priority: oldTask.priority,
        dueDate: oldTask.dueDate
      } : undefined
    });
    sendRealtimeNotification(userId, notification);
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};


exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = {};
    if (req.user.email !== 'admin@example.com') {
      query.user = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Sorting
    let sort = { createdAt: -1 }; // default sort
    if (sortBy) {
      const parts = sortBy.split(':');
      sort = {};
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please provide a task title');
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(dueDate) < today) {
        res.status(400);
        throw new Error('Due date cannot be in the past');
      }
    }

    const taskUser = (req.user.email === 'admin@example.com' && assignedUser)
      ? assignedUser
      : req.user._id;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: taskUser,
    });

    // Create notification if admin assigns to a normal user
    if (req.user.email === 'admin@example.com' && taskUser.toString() !== req.user._id.toString()) {
      await notifyUser(taskUser, 'added', task);
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      res.status(400);
      throw new Error('Please provide a task title');
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(dueDate) < today) {
        res.status(400);
        throw new Error('Due date cannot be in the past');
      }
    }

    const query = { _id: id };
    if (req.user.email !== 'admin@example.com') {
      query.user = req.user._id;
    }

    const task = await Task.findOne(query);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Capture old task details before applying updates
    const oldTaskSnapshot = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      user: task.user.toString()
    };

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    
    let isReassigned = false;
    const previousOwner = oldTaskSnapshot.user;
    let newOwner = previousOwner;

    if (req.user.email === 'admin@example.com' && assignedUser) {
      newOwner = assignedUser.toString();
      if (newOwner !== previousOwner) {
        task.user = assignedUser;
        isReassigned = true;
      }
    }

    const updatedTask = await task.save();
    const populatedUpdatedTask = await Task.findById(updatedTask._id).populate('user', 'name email');

    // Notification trigger if edited by Admin
    if (req.user.email === 'admin@example.com') {
      const adminIdStr = req.user._id.toString();

      if (isReassigned) {
        // Notify previous owner (if not admin) that task was removed
        if (previousOwner !== adminIdStr) {
          await notifyUser(previousOwner, 'deleted', oldTaskSnapshot);
        }
        // Notify new owner (if not admin) that task was added
        if (newOwner !== adminIdStr) {
          await notifyUser(newOwner, 'added', populatedUpdatedTask);
        }
      } else {
        // Notify current owner if not admin
        if (newOwner !== adminIdStr) {
          await notifyUser(newOwner, 'updated', populatedUpdatedTask, oldTaskSnapshot);
        }
      }
    }

    res.status(200).json({ message: 'Task updated successfully', task: populatedUpdatedTask });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = { _id: id };
    if (req.user.email !== 'admin@example.com') {
      query.user = req.user._id;
    }

    const task = await Task.findOne(query);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const taskOwner = task.user.toString();
    const oldTaskSnapshot = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
    };

    await task.deleteOne();

    // Notification trigger if deleted by Admin
    if (req.user.email === 'admin@example.com') {
      const adminIdStr = req.user._id.toString();
      if (taskOwner !== adminIdStr) {
        await notifyUser(taskOwner, 'deleted', oldTaskSnapshot);
      }
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
