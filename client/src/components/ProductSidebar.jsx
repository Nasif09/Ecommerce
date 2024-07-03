import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const ProductSidebar = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/api/products");
            const { payload } = response.data;
            setProducts(payload.products || []); 
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    
    useEffect(() => {
        getProducts();
    }, []);

    return (
        <aside className='sidebar'>
            <h2>List of Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>{product.name}</li>
                    ))}
                </ul>
        </aside>
    );
};

export default ProductSidebar;
