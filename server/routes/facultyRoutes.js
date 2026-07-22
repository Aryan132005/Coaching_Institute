const express = require('express');
const router = express.Router();
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getFaculty)
  .post(protect, adminOnly, createFaculty);

router.route('/:id')
  .put(protect, adminOnly, updateFaculty)
  .delete(protect, adminOnly, deleteFaculty);

module.exports = router;
