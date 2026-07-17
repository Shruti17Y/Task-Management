const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

exports.streamNotifications = (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Flush headers to establish connection
    res.flushHeaders();

    const userId = req.user._id;
    notificationService.registerClient(userId, res);

    // Send initial keepalive comment
    res.write(': sse connection established\n\n');

    // Keepalive ping every 30 seconds
    const keepAliveInterval = setInterval(() => {
      res.write(': keepalive ping\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(keepAliveInterval);
      notificationService.unregisterClient(userId, res);
      res.end();
    });
  } catch (error) {
    next(error);
  }
};
