const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getEnquiries,
  getMyEnquiries,
  updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');
const { enquiryValidator } = require('../middleware/validators');

router.route('/')
  .post(enquiryValidator, submitEnquiry)
  .get(protect, adminOnly, getEnquiries);

router.route('/my')
  .get(protect, getMyEnquiries);

router.route('/:id/status')
  .put(protect, adminOnly, updateEnquiryStatus);

module.exports = router;
