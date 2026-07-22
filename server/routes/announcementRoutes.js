const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/auth');
const { announcementValidator } = require('../middleware/validators');

router.route('/')
  .get(getAnnouncements)
  .post(protect, adminOnly, announcementValidator, createAnnouncement);

router.route('/:id')
  .put(protect, adminOnly, announcementValidator, updateAnnouncement)
  .delete(protect, adminOnly, deleteAnnouncement);

module.exports = router;
