const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
require('dotenv').config();


const users = [
    {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        isVerified: true,
    },
    {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password: 'password456',
        isVerified: true,
    },
    {
        name: 'Alice Brown',
        email: 'alicebrown@example.com',
        password: 'password789',
        isVerified: true,
    },
    {
        name: 'Bob Johnson',
        email: 'bobjohnson@example.com',
        password: 'password101112',
        isVerified: true,
    }
];

const categories = [
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Healthcare', type: 'expense' },
    { name: 'Bills', type: 'expense' },
    { name: 'Investments', type: 'income' },
];

const transactions = [
    // Transactions for John Doe
    { amount: 100, type: 'expense', category: 'Food', description: 'Groceries', date: '2023-08-01' },
    { amount: 50, type: 'expense', category: 'Transport', description: 'Gas', date: '2023-08-02' },
    { amount: 500, type: 'income', category: 'Salary', description: 'Monthly Salary', date: '2023-08-05' },
    { amount: 200, type: 'income', category: 'Freelance', description: 'Web Development', date: '2023-08-10' },

    // Transactions for Jane Smith
    { amount: 200, type: 'expense', category: 'Entertainment', description: 'Movie Night', date: '2023-07-15' },
    { amount: 75, type: 'expense', category: 'Transport', description: 'Uber ride', date: '2023-07-18' },
    { amount: 1000, type: 'income', category: 'Salary', description: 'Monthly Salary', date: '2023-07-25' },
    { amount: 400, type: 'income', category: 'Freelance', description: 'Graphic Design', date: '2023-07-30' },

    // Transactions for Alice Brown
    { amount: 50, type: 'expense', category: 'Healthcare', description: 'Doctor Visit', date: '2023-06-10' },
    { amount: 30, type: 'expense', category: 'Bills', description: 'Electricity Bill', date: '2023-06-20' },
    { amount: 2000, type: 'income', category: 'Salary', description: 'Monthly Salary', date: '2023-06-30' },
    { amount: 500, type: 'income', category: 'Investments', description: 'Stock Market Gains', date: '2023-06-25' },

    // Transactions for Bob Johnson
    { amount: 120, type: 'expense', category: 'Food', description: 'Groceries', date: '2023-05-12' },
    { amount: 50, type: 'expense', category: 'Transport', description: 'Fuel', date: '2023-05-14' },
    { amount: 800, type: 'income', category: 'Salary', description: 'Monthly Salary', date: '2023-05-20' },
    { amount: 300, type: 'income', category: 'Freelance', description: 'Photography Session', date: '2023-05-25' },
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        // Delete existing data before seeding
        await User.deleteMany();
        await Transaction.deleteMany();
        await Category.deleteMany();

        // Create users and hash their passwords
        const hashedPasswords = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                return user;
            })
        );
        const createdUsers = await User.insertMany(hashedPasswords);

        // Insert categories for each user
        const createdCategories = await Promise.all(
            createdUsers.map(user => {
                return Category.insertMany(categories.map(cat => ({
                    ...cat,
                    user: user._id, // Assign user to categories
                })));
            })
        );

        // Insert transactions with user and category references
        for (const user of createdUsers) {
            for (const transaction of transactions) {
                const category = await Category.findOne({ name: transaction.category, user: user._id });
                await Transaction.create({
                    ...transaction,
                    user: user._id, // Assign user to transactions
                    category: category._id, // Assign category to transaction
                });
            }
        }

        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding database', err);
        process.exit(1);
    });
