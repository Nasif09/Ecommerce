import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const FilterProducts = ({ id }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProductById = async () => {
        try {
            console.log(`Fetching product with id: ${id}`);
            const response = await Axios.get(`http://localhost:3001/api/products/${id}`);
            console.log('API Response:', response);
            const { payload } = response.data;
            console.log('Fetched product:', payload);
            setProduct(payload);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getProductById();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    return (
        <div>
            <h2>Product Details</h2>
            <ul>
                <li key={product._id}>{product.name}</li>
                {/* Add other product fields as needed */}
            </ul>
        </div>
    );
};

export default FilterProducts;
