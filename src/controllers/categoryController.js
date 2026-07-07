const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /categories

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); // Sort categories alphabetically by name
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        next(error); // Pass the error to the centralized error handling middleware
    }
}

exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error); // Pass the error to the centralized error handling middleware
    }
};