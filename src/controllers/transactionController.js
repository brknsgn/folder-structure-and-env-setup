// src/controllers/transactionController.js
const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a new transaction
// @route   POST /transactions
exports.createTransaction = async (req, res) => {
    try {
        // Attempt to create a transaction using the incoming body
        const transaction = await Transaction.create(req.body);

        // If successful, return the created object with a 201 (Created) status
        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        // Mongoose throws a 'ValidationError' if the schema rules are broken
        if (error.name === 'ValidationError') {
            // Extract all validation error messages into an array
            const messages = Object.values(error.errors).map(val => val.message);
            
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};