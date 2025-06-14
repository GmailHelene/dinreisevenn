const express = require('express');
const Attraction = require('../models/attraction');

const router = express.Router();

// Get attractions based on location
router.get('/:location', async (req, res) => {
    try {
        const { location } = req.params;
        const attractions = await Attraction.find({ location });
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attractions', error });
    }
});

// Create a new attraction
router.post('/', async (req, res) => {
    try {
        const newAttraction = new Attraction(req.body);
        await newAttraction.save();
        res.status(201).json(newAttraction);
    } catch (error) {
        res.status(400).json({ message: 'Error creating attraction', error });
    }
});

// Update an attraction
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAttraction = await Attraction.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAttraction);
    } catch (error) {
        res.status(400).json({ message: 'Error updating attraction', error });
    }
});

// Delete an attraction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Attraction.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting attraction', error });
    }
});

module.exports = router;