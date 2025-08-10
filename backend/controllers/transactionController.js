const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc Get all transactions for logged-in user, with filters
const getTransactions = async (req, res) => {
    const { type, category, startDate, endDate } = req.query;

    const filter = { user: req.user.id };

    if (type) {
        filter.type = type;
    }

    if (category) {
        filter.category = category;
    }

    if (startDate && endDate) {
        filter.date = {
            $gte: new Date(startDate),  // Ensure date is parsed correctly
            $lte: new Date(endDate),
        };
    } else if (startDate) {
        filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
        filter.date = { $lte: new Date(endDate) };
    }

    try {
        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error("Get Transactions Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// @desc Add new transaction
const addTransaction = async (req, res) => {
    const { amount, type, category, description, date } = req.body;
    try {
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type,
            category,
            description,
            date: date || Date.now(),
        });
        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await transaction.deleteOne();
        res.json({ message: "Transaction removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Update transaction by ID
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { amount, type, category, description, date } = req.body;

        // Update fields only if provided
        if (amount !== undefined) transaction.amount = amount;
        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (description !== undefined) transaction.description = description;
        if (date) transaction.date = date;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//monthly summary

const getMonthlySummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        // convert string to ObjectId

        const summary = await Transaction.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    income: 1,
                    expense: 1,
                    netSavings: { $subtract: ["$income", "$expense"] },
                    _id: 0
                }
            },
            { $sort: { year: -1, month: -1 } }
        ]);

        res.json(summary);
    } catch (error) {
        console.error("Monthly Summary Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Export all functions
module.exports = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getMonthlySummary,
};
