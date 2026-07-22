const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');
const { courseValidator } = require('../middleware/validators');

router.route('/')
  .get(getCourses)
  .post(protect, adminOnly, courseValidator, createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, adminOnly, courseValidator, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

module.exports = router;
