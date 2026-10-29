
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SellerDashboard from "./SellerDashboard";
import ForgotPassword from "./ForgotPassword";

function App() {
    const [page, setPage] = useState("login");
    const [loggedInSeller, setLoggedInSeller] = useState(null);

    const handleLoginSuccess = (sellerData) => {
        setLoggedInSeller(sellerData);
        setPage("dashboard");
    };

    const handleLogout = () => {
        setLoggedInSeller(null);
        setPage("login");
    };

    // Update seller details after a successful profile update
    const handleSellerUpdate = (updatedSeller) => {
        setLoggedInSeller(updatedSeller);
    };

    return (
        <>
            {page === "login" && (
                <Login
                    onShowRegister={() => setPage("register")}
                    onShowForgotPassword={() =>
                        setPage("forgotPassword")
                    }
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {page === "register" && (
                <Register
                    onShowLogin={() => setPage("login")}
                />
            )}

            {page === "forgotPassword" && (
                <ForgotPassword
                    onBackToLogin={() => setPage("login")}
                />
            )}

            {page === "dashboard" && loggedInSeller && (
                <SellerDashboard
                    seller={loggedInSeller}
                    onLogout={handleLogout}
                    onSellerUpdate={handleSellerUpdate}
                />
            )}
        </>
    );
}

export default App;
