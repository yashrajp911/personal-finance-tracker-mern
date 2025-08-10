const Category = require('../models/Category');

// @desc Get all categories for logged-in user
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id }).sort('name');
        res.json(categories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create new category
const createCategory = async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: "Category name and type are required" });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid category type" });
    }

    try {
        const category = new Category({
            user: req.user.id,
            name: name.trim(),
            type,
        });

        const created = await category.save();
        res.status(201).json(created);
    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update category
const updateCategory = async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: "Category name and type are required" });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid category type" });
    }

    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        if (category.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

        category.name = name.trim();
        category.type = type;

        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        if (category.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

        await category.deleteOne();
        res.json({ message: "Category deleted" });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
