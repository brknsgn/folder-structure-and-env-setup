const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');

router.route('/')
	.get(getCategories) // GET /categories - Retrieve all categories
	.post(createCategory); // POST /categories - Create a new category

module.exports = router;
