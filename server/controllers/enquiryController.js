const Enquiry = require('../models/enquiry');

// @desc    Submit a new contact enquiry
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      status: 'pending',
    });

    res.status(201).json(enquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's enquiries
// @route   GET /api/enquiries/my
// @access  Private (Student)
const getMyEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status (resolved / pending)
// @route   PUT /api/enquiries/:id/status
// @access  Private/Admin
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'resolved'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be pending or resolved');
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status;
      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404);
      throw new Error('Enquiry not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  getMyEnquiries,
  updateEnquiryStatus,
};
