const Announcement = require('../models/announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const announcement = new Announcement({
      title,
      description,
      postedBy: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, description, isActive } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
      announcement.title = title || announcement.title;
      announcement.description = description || announcement.description;
      if (isActive !== undefined) {
        announcement.isActive = isActive;
      }

      const updatedAnnouncement = await announcement.save();
      res.json(updatedAnnouncement);
    } else {
      res.status(404);
      throw new Error('Announcement not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
      await Announcement.deleteOne({ _id: req.params.id });
      res.json({ message: 'Announcement removed successfully' });
    } else {
      res.status(404);
      throw new Error('Announcement not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
