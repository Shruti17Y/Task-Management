const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/mark-read', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.get('/stream', notificationController.streamNotifications);

module.exports = router;
