const { Notification } = require('../models');

const getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

const markAsRead = async (userId, notificationId) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  return notif;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { message: 'All notifications marked as read.' };
};

const deleteNotification = async (userId, notificationId) => {
  await Notification.findOneAndDelete({ _id: notificationId, userId });
  return { message: 'Notification deleted.' };
};

const createNotification = async (userId, data) => {
  return await Notification.create({
    userId,
    type: data.type,
    title: data.title,
    message: data.message,
    actionLink: data.actionLink || '',
    metadata: data.metadata || {}
  });
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
