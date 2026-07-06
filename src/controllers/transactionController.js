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

// @desc    Get a single transaction
// @route   GET /transactions/:id
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error); // Pass the error to the centralized middleware
    }
};

// @desc    Update a transaction
// @route   PUT /transactions/:id
exports.updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a transaction
// @route   DELETE /transactions/:id
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// Add this to your src/controllers/transactionController.js
// Make sure to export it and link it to a GET /summary route!

// @desc    Get summary of transactions (income, expense, balance, category totals)
// @route   GET /transactions/summary 
exports.getSummary = async (req, res, next) => {
    try {
        // 1. Calculate overall income and expense
        const totals = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type", // Group documents by 'income' or 'expense'
                    totalAmount: { $sum: "$amount" } // Accumulate the 'amount' field
                }
            }
        ]);

        // Transform the array response into simple variables
        let income = 0;
        let expense = 0;

        totals.forEach(item => {
            if (item._id === 'income') income = item.totalAmount;
            if (item._id === 'expense') expense = item.totalAmount;
        });

        const balance = income - expense;

        // 2. Calculate expenses grouped by category
        const categoryExpenses = await Transaction.aggregate([
            {
                $match: { type: 'expense' } // Filter: Only process expenses
            },
            {
                $group: {
                    _id: "$category", // Group by the category name
                    totalSpent: { $sum: "$amount" } // Add up the amounts
                }
            },
            {
                $sort: { totalSpent: -1 } // Sort by totalSpent in descending order
            }
        ]);

        // Send the final compiled object back to the client
        res.status(200).json({
            success: true,
            data: {
                income,
                expense,
                balance,
                categoryExpenses
            }
        });
    } catch (error) {
        next(error);
    }
};