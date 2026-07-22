const nodemailer = require('nodemailer');
const { Enquiry } = require('../config/db');

// Helper to send email alerts to admin
const sendEnquiryEmail = async (enquiry) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.warn('[EMAIL WARNING] EMAIL_USER or EMAIL_PASS not configured in .env. Logging email details to console:');
      console.log(`
      --------------------------------------------------
      [MOCK EMAIL SENT TO: aryansaini132005@gmail.com]
      Subject: New Visitor Enquiry from ${enquiry.name}
      Name: ${enquiry.name}
      Email: ${enquiry.email}
      Phone: ${enquiry.phone}
      Message: ${enquiry.message}
      --------------------------------------------------
      `);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"Apex Academy Portal" <${emailUser}>`,
      to: 'aryansaini132005@gmail.com',
      subject: `New Visitor Enquiry from ${enquiry.name}`,
      text: `Hello Admin,\n\nYou have received a new contact enquiry on the Apex Academy Coaching Portal.\n\nDetails:\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nMessage: ${enquiry.message}\n\nPlease review and resolve this in the Admin Panel.\n\nBest regards,\nApex Academy System`,
      html: `
        <h3>New Portal Enquiry</h3>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Message:</strong> ${enquiry.message}</p>
        <br/>
        <p><em>Resolve this query inside your Admin Dashboard.</em></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] Notification email successfully sent: ${info.messageId}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email alert: ${error.message}`);
  }
};

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

    // Send email alert asynchronously without blocking HTTP response
    sendEnquiryEmail(enquiry);

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
    const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] });
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
    const enquiries = await Enquiry.findAll({
      where: { email: req.user.email },
      order: [['createdAt', 'DESC']],
    });
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

    const enquiry = await Enquiry.findByPk(req.params.id);

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
