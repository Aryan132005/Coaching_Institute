const { Op } = require('sequelize');
const { Course } = require('../config/db');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let whereClause = {};

    if (category) {
      whereClause.category = {
        [Op.like]: `%${category}%`,
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const courses = await Course.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  try {
    const { title, description, duration, fees, category, faculty, seatsAvailable, image } = req.body;

    const course = await Course.create({
      title,
      description,
      duration,
      fees,
      category,
      faculty,
      seatsAvailable: seatsAvailable || 30,
      image: image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    const { title, description, duration, fees, category, faculty, seatsAvailable, image } = req.body;

    const course = await Course.findByPk(req.params.id);

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.duration = duration || course.duration;
      course.fees = fees !== undefined ? fees : course.fees;
      course.category = category || course.category;
      course.faculty = faculty || course.faculty;
      course.seatsAvailable = seatsAvailable !== undefined ? seatsAvailable : course.seatsAvailable;
      course.image = image || course.image;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      await course.destroy();
      res.json({ message: 'Course removed successfully' });
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
