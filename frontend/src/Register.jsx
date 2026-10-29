
import { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register({ onShowLogin }) {
    const [seller, setSeller] = useState({
        sellerName: "",
        shopName: "",
        mobile: "",
        area: "",
        city: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setSeller({
            ...seller,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:3108/api/sellers/register",
                seller
            );

            setMessage(response.data);

            setSeller({
                sellerName: "",
                shopName: "",
                mobile: "",
                area: "",
                city: "",
                password: ""
            });
        } catch (error) {
            setMessage(
                error.response?.data ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="register-page">
            <form
                className="register-card"
                onSubmit={handleSubmit}
            >
                <h1>Seller Registration</h1>
                <p className="register-subtitle">
                    Create your account and add your shop details
                </p>

                <div className="register-field">
                    <label htmlFor="sellerName">Seller Name</label>
                    <input
                        id="sellerName"
                        type="text"
                        name="sellerName"
                        placeholder="Enter seller name"
                        value={seller.sellerName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="shopName">Shop Name</label>
                    <input
                        id="shopName"
                        type="text"
                        name="shopName"
                        placeholder="Enter shop name"
                        value={seller.shopName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input
                        id="mobile"
                        type="tel"
                        name="mobile"
                        placeholder="Enter 10-digit mobile number"
                        value={seller.mobile}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="area">Shop Area</label>
                    <input
                        id="area"
                        type="text"
                        name="area"
                        placeholder="Example: Kukatpally"
                        value={seller.area}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="Example: Hyderabad"
                        value={seller.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Create password"
                        value={seller.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />
                </div>

                <button
                    className="register-button"
                    type="submit"
                >
                    Register
                </button>

                {message && (
                    <p className="register-message">
                        {message}
                    </p>
                )}

                <div className="register-login-text">
                    Already have an account?{" "}
                    <span onClick={onShowLogin}>
                        Login here
                    </span>
                </div>
            </form>
        </div>
    );
}

export default Register;
