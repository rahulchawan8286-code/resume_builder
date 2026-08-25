const express = require('express');
const {
  getMe,
  updateDetails,
  updateProfilePhoto,
  deleteMe
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(protect);

router.route('/me')
  .get(getMe)
  .delete(deleteMe);

router.put('/updatedetails', updateDetails);
router.put('/profile-photo', updateProfilePhoto);

module.exports = router;
