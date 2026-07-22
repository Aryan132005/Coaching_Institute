const Course = require('../models/course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
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
    const course = await Course.findById(req.params.id);

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

    const course = new Course({
      title,
      description,
      duration,
      fees,
      category,
      faculty,
      seatsAvailable: seatsAvailable || 30,
      image: image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
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

    const course = await Course.findById(req.params.id);

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
    const course = await Course.findById(req.params.id);

    if (course) {
      await Course.deleteOne({ _id: req.params.id });
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
