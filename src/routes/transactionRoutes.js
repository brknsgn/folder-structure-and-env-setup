// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionController');

// Map the routes to the controller methods
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

module.exports = router;