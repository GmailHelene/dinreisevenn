const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const attractionController = require('../controllers/attractionController');
const bookingController = require('../controllers/bookingController');

// Route for generating travel suggestions
router.post('/generate-travel-suggestions', suggestionController.generateSuggestions);

// Route for fetching attractions based on location
router.get('/attractions/:location', attractionController.getAttractions);

// Route for fetching booking information
router.post('/bookings', bookingController.createBooking);

module.exports = router;

