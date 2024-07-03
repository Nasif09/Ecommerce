import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const GetProductById = ({ id }) => {
    const [product, setProduct] = useState([]); // Initialize with an empty array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProductById = async () => {
        try {
            console.log(`Fetching product with id: ${id}`);
            const response = await Axios.get(`http://localhost:3001/api/products/${id}`);
            console.log('API Response:', response);
            const { payload } = response.data;
            console.log('Fetched product:', payload);
            setProduct(payload);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getProductById();
        }
    }, [id]);

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>Error loading product: {error.message}</div>;
    }

    if (product.length === 0) {
        return <div>No products found</div>;
    }

    return (
        <div>
            <h2>Filter products</h2>
            <ul>
                {product.map((prod) => (
                    <li key={prod._id}>{prod.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default GetProductById;
