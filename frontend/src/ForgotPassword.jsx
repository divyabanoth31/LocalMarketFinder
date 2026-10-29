
import { useState } from "react";
import axios from "axios";
import "./Login.css";

function ForgotPassword({ onBackToLogin }) {
    const [mobile, setMobile] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(
                "http://localhost:3108/api/sellers/reset-password",
                {
                    mobile,
                    newPassword
                }
            );

            setMessage(
                response.data || "Password reset successfully."
            );
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Password reset failed. Check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <h1>🏪 Local Market Finder</h1>
                <h3>Kirana Store Management</h3>

                <h2>
                    Reset Your Password
                    <br />
                    Access Your Store Again
                </h2>

                <p>
                    Set a new password for your demo seller account.
                </p>

                <div className="features">
                    <span>🔐 Reset Password</span>
                    <span>🏪 Manage Your Store</span>
                </div>

                <p className="footer-text">
                    🌿 Local Shops • Stronger Communities
                </p>
            </div>

            <div className="login-right">
                <form className="login-card" onSubmit={handleReset}>
                    <h1>Forgot Password</h1>
                    <p>Enter your registered mobile number</p>

                    <label>Mobile Number *</label>
                    <input
                        type="tel"
                        placeholder="Enter registered mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                    />

                    <label>New Password *</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    <label>Confirm New Password *</label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        minLength={6}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Reset Password"}
                    </button>

                    {message && (
                        <p role="status">{message}</p>
                    )}

                    <div className="register-text">
                        Remember your password?{" "}
                        <span onClick={onBackToLogin}>
                            Back to Login
                        </span>
                    </div>

                    
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
