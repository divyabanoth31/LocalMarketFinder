
import { useState, useEffect } from 'react';
import axios from 'axios';

function ViewProducts() {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3108/getproductlist'
            );

            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Unable to load products');
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div>
            <h2>Product List</h2>

            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Stock Quantity</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {products.length === 0 && (
                <p>No products available.</p>
            )}
        </div>
    );
}

export default ViewProducts;
