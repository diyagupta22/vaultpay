const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/dashboard',
  authMiddleware,
  allowRoles('admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome Admin',
    });
  }
);

module.exports = router;
