const Transaction = require('../models/Transaction'); 

// @desc    Get all transactions with pagination & filtering
// @route   GET /transactions
exports.getTransactions = async (req, res, next) => {
    try {
        // Set up pagination variables (default to page 1, limit 10)
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const skip = (page - 1) * limit; 

        // Create the filter object for the MongoDB query
        const filter = {};

        // 1. Category Filter: Add to query only if a specific category is selected
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }

        // 2. Date Filter: Find transactions that match the exact selected day
        if (req.query.date && req.query.date.trim() !== '') {
            const targetDate = new Date(req.query.date);
            const nextDate = new Date(targetDate);
            nextDate.setDate(nextDate.getDate() + 1); // Move to the next day to create a 24-hour range

            filter.date = {
                $gte: targetDate, // Greater than or equal to the selected date
                $lt: nextDate     // Strictly less than the next day
            };
        }

        // Fetch filtered, populated, sorted, and paginated transactions from the database
        const transactions = await Transaction.find(filter)
            .populate('category', 'name color') 
            .sort({ date: -1 }) 
            .skip(skip) 
            .limit(limit); 

        // Count total documents that match the filter for accurate pagination calculation
        const total = await Transaction.countDocuments(filter); 
        
        // Send the final response to the client
        res.status(200).json({ 
            success: true,
            count: transactions.length,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1
            },
            data: transactions 
        });
    } catch (error) {
       next(error); 
    }
};

// @desc    Add a new transaction
// @route   POST /transactions
exports.createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json({ success: true, data: transaction });
    } catch (error) { next(error); }
};

// @desc    Get a single transaction
// @route   GET /transactions/:id
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
        res.status(200).json({ success: true, data: transaction });
    } catch (error) { next(error); }
};

// @desc    Update a transaction
// @route   PUT /transactions/:id
exports.updateTransaction = async (req, res, next) => {
    try {
        const allowedUpdates = ['amount', 'type', 'category', 'note', 'date']; 
        const updateData = {}; 
        
        // Ensure only allowed fields are updated
        for (const key of Object.keys(req.body)) {
            if (allowedUpdates.includes(key)) updateData[key] = req.body[key]; 
        }

        const transaction = await Transaction.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }); 
        if (!transaction) {
            const error = new Error('Transaction not found'); 
            error.statusCode = 404; 
            return next(error);
        }
        res.status(200).json({ success: true, data: transaction }); 
    } catch (error) { next(error); }
};

// @desc    Delete a transaction
// @route   DELETE /transactions/:id
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

// @desc    Get summary of transactions (income, expense, balance)
// @route   GET /transactions/summary 
exports.getSummary = async (req, res, next) => {
    try {
        // Calculate total income and expense using MongoDB aggregation
        const totals = await Transaction.aggregate([
            { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
        ]);

        let income = 0;
        let expense = 0;
        totals.forEach(item => {
            if (item._id === 'income') income = item.totalAmount;
            if (item._id === 'expense') expense = item.totalAmount;
        });

        const balance = income - expense;

        // Calculate expenses grouped by category for the pie chart
        const categoryExpenses = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
            { $sort: { totalSpent: -1 } }
        ]);

        res.status(200).json({ success: true, data: { income, expense, balance, categoryExpenses } });
    } catch (error) { next(error); }
};