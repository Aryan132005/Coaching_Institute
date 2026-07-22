const { Faculty } = require('../config/db');

// @desc    Get all faculty members
// @route   GET /api/faculty
// @access  Public
const getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findAll();
    res.json(faculty);
  } catch (error) {
    next(error);
  }
};

// @desc    Create faculty profile
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res, next) => {
  try {
    const { name, subject, qualification, experience, photo, bio } = req.body;

    const faculty = await Faculty.create({
      name,
      subject,
      qualification,
      experience,
      photo: photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
      bio,
    });

    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res, next) => {
  try {
    const { name, subject, qualification, experience, photo, bio } = req.body;

    const faculty = await Faculty.findByPk(req.params.id);

    if (faculty) {
      faculty.name = name || faculty.name;
      faculty.subject = subject || faculty.subject;
      faculty.qualification = qualification || faculty.qualification;
      faculty.experience = experience !== undefined ? experience : faculty.experience;
      faculty.photo = photo || faculty.photo;
      faculty.bio = bio || faculty.bio;

      const updatedFaculty = await faculty.save();
      res.json(updatedFaculty);
    } else {
      res.status(404);
      throw new Error('Faculty not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty profile
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);

    if (faculty) {
      await faculty.destroy();
      res.json({ message: 'Faculty profile removed successfully' });
    } else {
      res.status(404);
      throw new Error('Faculty not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
