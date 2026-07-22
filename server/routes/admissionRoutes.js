const express = require('express');
const router = express.Router();
const {
  submitAdmission,
  getAdmissions,
  getMyAdmissions,
  updateAdmissionStatus,
} = require('../controllers/admissionController');
const { protect, adminOnly } = require('../middleware/auth');
const { admissionValidator } = require('../middleware/validators');

router.route('/')
  .post(protect, admissionValidator, submitAdmission)
  .get(protect, adminOnly, getAdmissions);

router.route('/my')
  .get(protect, getMyAdmissions);

router.route('/:id/status')
  .put(protect, adminOnly, updateAdmissionStatus);

module.exports = router;
