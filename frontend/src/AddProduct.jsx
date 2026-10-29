
import { useState } from 'react';
import axios from 'axios';

function AddProduct() {
    const [product, setProduct] = useState({
        productName: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: ''
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3108/addproduct',
                {
                    ...product,
                    price: Number(product.price),
                    stockQuantity: Number(product.stockQuantity)
                }
            );

            alert('Product added successfully!');
            console.log(response.data);

            setProduct({
                productName: '',
                category: '',
                price: '',
                stockQuantity: '',
                description: ''
            });
        } catch (error) {
            console.error(error);
            alert('Failed to add product. Check the backend.');
        }
    };

    return (
        <div>
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={product.productName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={product.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={handleChange}
                />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
