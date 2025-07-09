const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const attractionController = require('../controllers/attractionController');
const bookingController = require('../controllers/bookingController');
const budgetValidator = require('../middleware/budgetValidator');

// Route for generating travel suggestions
router.use('/suggestions', suggestionController);

// Route for fetching attractions based on location
router.use('/attractions', attractionController);

// Route for booking management
router.use('/bookings', bookingController);

module.exports = router;

