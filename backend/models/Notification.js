const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['added', 'updated', 'deleted'],
      required: true,
    },
    taskDetails: {
      title: { type: String, required: true },
      description: { type: String },
      status: { type: String },
      priority: { type: String },
      dueDate: { type: Date },
    },
    oldTaskDetails: {
      title: { type: String },
      description: { type: String },
      status: { type: String },
      priority: { type: String },
      dueDate: { type: Date },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
