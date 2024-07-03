import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import FilterProducts from './FilterProducts';

const CategoriesSidebar = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const getCategories = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/api/categories");
            const { payload } = response.data;
            setCategories(payload || []); 
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <aside className='sidebar'>
            <h2>All categories</h2>
            <label>
                <select 
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}>
                    {categories.map((category) => (
                        <option value={category._id} key={category._id}>{category.name}</option>
                    ))}
                </select>
            </label>
            <hr />
            <p>Your favorite categories: {selectedCategory}</p>
            {selectedCategory && <FilterProducts id={selectedCategory} />}
        </aside>
    );
};

export default CategoriesSidebar;
