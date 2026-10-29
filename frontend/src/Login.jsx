
import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({
    onShowRegister,
    onLoginSuccess,
    onShowForgotPassword
}) {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3108/api/sellers/login",
                { mobile, password }
            );

            if (response.status === 200) {
                onLoginSuccess(response.data);
            }
        } catch (error) {
            setMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Login failed. Please check your details and backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <h1>🏪 Local Market Finder</h1>
                <h3>SMART KIRANA STORE MANAGEMENT</h3>

                <h2>
                    Your Store. Your Products.
                    <br />
                    Your Growth.
                </h2>

                <p>
                    Simplify your daily store operations with smart
                    digital tools. Manage products, monitor stock,
                    and keep your local business growing.
                </p>

                <div className="shop-illustration">
                    <img
                        src="https://webupon.com/wp-content/uploads/2024/02/v2-7amw0-ibsx6.jpg"
                        alt="Local Market Store"
                        className="shop-image"
                    />
                </div>

                <div className="features">
                    <span>📦 Easy Product Management</span>
                    <span>📋 Smart Stock Monitoring</span>
                    <span>📈 Grow Your Business</span>
                </div>

                <p className="footer-text">
                    🌿 Local Shops • Stronger Communities
                </p>
            </div>

            <div className="login-right">
                <form className="login-card" onSubmit={handleLogin}>
                    <h1>Seller Login</h1>
                    <p>Access your kirana store account</p>

                    <label>Mobile Number *</label>
                    <input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                    />

                    <label>Password *</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="forgot">
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={onShowForgotPassword}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onShowForgotPassword();
                                }
                            }}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Checking..." : "Login"}
                    </button>

                    {message && (
                        <p role="status">{message}</p>
                    )}

                    <div className="register-text">
                        Don't have an account?{" "}
                        <span onClick={onShowRegister}>
                            Register here
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
