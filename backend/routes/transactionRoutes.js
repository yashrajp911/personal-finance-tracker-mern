const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getMonthlySummary,
} = require('../controllers/transactionController.js')

const router = express.Router();

router.route("/")
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route("/:id")
    .delete(protect, deleteTransaction)
    .put(protect, updateTransaction);

router.get('/summary/monthly', protect, getMonthlySummary);

module.exports = router;
