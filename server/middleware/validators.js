const { body, validationResult } = require('express-validator');

// Middleware to run validations and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('role').optional().isIn(['student', 'admin']).withMessage('Invalid role'),
  validate,
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const courseValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('fees').isNumeric().withMessage('Fees must be a numeric value'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('faculty').trim().notEmpty().withMessage('Faculty name is required'),
  body('seatsAvailable').optional().isInt({ min: 0 }).withMessage('Seats must be a non-negative integer'),
  body('image').optional().trim().isURL().withMessage('If provided, image must be a valid URL'),
  validate,
];

const admissionValidator = [
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('courseId').trim().isMongoId().withMessage('Invalid Course ID reference'),
  body('documents').optional().trim(),
  validate,
];

const enquiryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  validate,
];

const announcementValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  courseValidator,
  admissionValidator,
  enquiryValidator,
  announcementValidator,
};
