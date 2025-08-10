import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import './CSS/Categories.css';

const Categories = () => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [categoryData, setCategoryData] = useState({ name: '', type: 'income' });

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Add or Update Category
    const handleAddCategory = async () => {
        if (!categoryData.name || !categoryData.type) return;

        try {
            if (categoryData._id) {
                // Update existing category
                const res = await API.put(`/categories/${categoryData._id}`, {
                    name: categoryData.name,
                    type: categoryData.type,
                });
                setCategories(categories.map(cat => (cat._id === res.data._id ? res.data : cat)));
            } else {
                // Create new category
                const res = await API.post('/categories', categoryData);
                setCategories([...categories, res.data]);
            }
            setCategoryData({ name: '', type: 'income' });
            setShowForm(false);
            setError('');
        } catch (err) {
            setError('Error saving category');
        }
    };

    // Delete Category
    const handleDeleteCategory = async (id) => {
        try {
            await API.delete(`/categories/${id}`);
            setCategories(categories.filter(cat => cat._id !== id));
            setError('');
        } catch (err) {
            setError('Failed to delete category');
        }
    };

    // Prepare form for editing category
    const handleEditCategory = (category) => {
        setCategoryData({ ...category });
        setShowForm(true);
        setError('');
    };

    return (
        <div className="categories-container">
            <h2 className="categories-title">Your Categories</h2>

            <div className="categories-actions">
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setCategoryData({ name: '', type: 'income' });
                        setError('');
                    }}
                    className="add-category-button"
                >
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showForm && (
                <div className="category-form-card">
                    <h3>{categoryData._id ? 'Edit' : 'Add'} Category</h3>
                    <div className="form-group1">
                        <label>Name</label>
                        <input
                            type="text"
                            value={categoryData.name}
                            onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                            placeholder="Category Name"
                        />
                    </div>

                    <div className="form-group2">
                        <label>Type</label>
                        <select
                            value={categoryData.type}
                            onChange={(e) => setCategoryData({ ...categoryData, type: e.target.value })}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button onClick={handleAddCategory} className="submit-button">
                            {categoryData._id ? 'Update' : 'Add'} Category
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <>
                    {error && <p className="error-text">{error}</p>}
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No categories found</td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>{category.type}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEditCategory(category)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Categories;
