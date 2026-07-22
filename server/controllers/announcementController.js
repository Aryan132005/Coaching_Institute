const { Announcement, User } = require('../config/db');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
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

    const announcement = await Announcement.create({
      title,
      description,
      postedBy: req.user.id,
    });

    res.status(201).json(announcement);
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

    const announcement = await Announcement.findByPk(req.params.id);

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
    const announcement = await Announcement.findByPk(req.params.id);

    if (announcement) {
      await announcement.destroy();
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
