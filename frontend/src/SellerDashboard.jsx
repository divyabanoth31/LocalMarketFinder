
import { useEffect, useState } from "react";
import axios from "axios";
import "./SellerDashboard.css";

const API = "http://localhost:3108";

const emptyProduct = {
    productName: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: ""
};

function SellerDashboard({ seller, onLogout, onSellerUpdate }) {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ ...emptyProduct });
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const [editProfile, setEditProfile] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const [profile, setProfile] = useState({
        sellerName: seller?.sellerName || "",
        shopName: seller?.shopName || "",
        mobile: seller?.mobile || "",
        area: seller?.area || "",
        city: seller?.city || ""
    });

    useEffect(() => {
        if (seller?.id) {
            loadProducts();
        }
    }, [seller?.id]);

    useEffect(() => {
        setProfile({
            sellerName: seller?.sellerName || "",
            shopName: seller?.shopName || "",
            mobile: seller?.mobile || "",
            area: seller?.area || "",
            city: seller?.city || ""
        });
    }, [
        seller?.id,
        seller?.sellerName,
        seller?.shopName,
        seller?.mobile,
        seller?.area,
        seller?.city
    ]);

    const loadProducts = async () => {
        try {
            const response = await axios.get(
                `${API}/getproductlist/${seller.id}`
            );
            setProducts(response.data);
            setMessage("");
        } catch (error) {
            setMessage("Products load avvaledu. Backend check cheyyi.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!seller?.id) {
            setMessage("Seller details missing. Please login again.");
            return;
        }

        if (
            !profile.sellerName.trim() ||
            !profile.shopName.trim() ||
            !/^[0-9]{10}$/.test(profile.mobile.trim()) ||
            !profile.area.trim() ||
            !profile.city.trim()
        ) {
            setMessage(
                "Please enter all details correctly. Mobile number must be 10 digits."
            );
            return;
        }

        setProfileLoading(true);

        try {
            const updatedDetails = {
                sellerName: profile.sellerName.trim(),
                shopName: profile.shopName.trim(),
                mobile: profile.mobile.trim(),
                area: profile.area.trim(),
                city: profile.city.trim()
            };

            const response = await axios.put(
                `${API}/api/sellers/${seller.id}`,
                updatedDetails
            );

            const updatedSeller = {
                ...seller,
                ...updatedDetails
            };

            if (onSellerUpdate) {
                onSellerUpdate(updatedSeller);
            }

            setProfile(updatedDetails);
            setEditProfile(false);
            setMessage(
                typeof response.data === "string"
                    ? response.data
                    : "Profile updated successfully!"
            );
        } catch (error) {
            setMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Profile update failed. Please check the backend."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const resetForm = () => {
        setProduct({ ...emptyProduct });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!seller?.id) {
            setMessage("Seller details missing. Please login again.");
            return;
        }

        if (
            !product.productName.trim() ||
            !product.category.trim() ||
            product.price === "" ||
            product.stockQuantity === ""
        ) {
            setMessage("Please fill all required fields.");
            return;
        }

        if (
            Number(product.price) <= 0 ||
            Number(product.stockQuantity) < 0
        ) {
            setMessage("Enter a valid price and stock quantity.");
            return;
        }

        setLoading(true);

        const payload = {
            productName: product.productName.trim(),
            category: product.category.trim(),
            price: Number(product.price),
            stockQuantity: Number(product.stockQuantity),
            description: product.description.trim()
        };

        try {
            if (editId === null) {
                await axios.post(
                    `${API}/addproduct/${seller.id}`,
                    payload
                );
                setMessage("Product added successfully!");
            } else {
                await axios.put(
                    `${API}/updateproduct/${editId}/seller/${seller.id}`,
                    payload
                );
                setMessage("Product updated successfully!");
            }

            resetForm();
            await loadProducts();
        } catch (error) {
            setMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Save failed. Please check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setProduct({
            productName: item.productName ?? "",
            category: item.category ?? "",
            price: String(item.price ?? ""),
            stockQuantity: String(item.stockQuantity ?? ""),
            description: item.description ?? ""
        });

        setEditId(item.id);
        setMessage("");
        setActiveMenu("Products");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            await axios.delete(
                `${API}/deleteproduct/${id}/seller/${seller.id}`
            );

            setMessage("Product deleted successfully!");

            if (editId === id) {
                resetForm();
            }

            await loadProducts();
        } catch (error) {
            setMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Delete failed. Please try again."
            );
        }
    };

    const categories = [
        ...new Set(
            products
                .map((item) => item.category?.trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    const filteredProducts = products.filter((item) => {
        const matchesSearch =
            `${item.productName ?? ""} ${item.category ?? ""}`
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            item.category?.trim().toLowerCase() ===
                selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    const totalStockValue = products.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
                Number(item.stockQuantity || 0),
        0
    );

    const lowStock = products.filter(
        (item) => Number(item.stockQuantity) <= 5
    ).length;

    const menuItems = [
        { name: "Dashboard", icon: "▦" },
        { name: "My Shop", icon: "🏪" },
        { name: "Products", icon: "📦" },
        { name: "Profile", icon: "👤" }
    ];

    const renderStats = () => (
        <div className="dashboard-cards">
            <div className="dashboard-card">
                <h3>Total Products</h3>
                <h2>{products.length}</h2>
            </div>

            <div className="dashboard-card">
                <h3>Total Categories</h3>
                <h2>{categories.length}</h2>
            </div>

            <div className="dashboard-card">
                <h3>Total Stock Value</h3>
                <h2>₹ {totalStockValue.toLocaleString("en-IN")}</h2>
            </div>

            <div className="dashboard-card">
                <h3>Low Stock Items</h3>
                <h2>{lowStock}</h2>
            </div>
        </div>
    );

    const renderProductForm = () => (
        <section className="product-section">
            <h3>
                📦 {editId === null ? "Add Product" : "Update Product"}
            </h3>

            <form className="product-form" onSubmit={handleSubmit}>
                <label>Product Name *</label>
                <input
                    name="productName"
                    value={product.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                />

                <label>Category *</label>
                <input
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    placeholder="e.g. Groceries, Fruits, Vegetables"
                    required
                />

                <label>Price (₹) *</label>
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                />

                <label>Stock Quantity *</label>
                <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Enter product details"
                    rows="3"
                />

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Saving..."
                            : editId === null
                            ? "Add Product"
                            : "Update Product"}
                    </button>

                    {editId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );

    const renderProductTable = () => (
        <section className="product-section">
            <h3>Product List</h3>

            <div className="product-filters">
                <input
                    className="product-search"
                    placeholder="Search product or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <p className="filter-result">
                Showing {filteredProducts.length} of {products.length} products
            </p>

            <div className="product-table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.productName}</td>
                                <td>{item.category}</td>
                                <td>₹ {item.price}</td>
                                <td>{item.stockQuantity}</td>
                                <td>{item.description}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>{" "}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="7">
                                    No products match your search or category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );

    return (
        <div className="dashboard-page">
            <header className="dashboard-topbar">
                <h2>🏪 Local Market Finder</h2>

                <div>
                    <span>{seller?.sellerName || "Seller"}</span>{" "}
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <h3>Menu</h3>

                    {menuItems.map((item) => (
                        <p
                            key={item.name}
                            className={
                                activeMenu === item.name ? "active-menu" : ""
                            }
                            onClick={() => {
                                setActiveMenu(item.name);
                                setMessage("");

                                if (item.name !== "Products") {
                                    resetForm();
                                }

                                if (item.name !== "Profile") {
                                    setEditProfile(false);
                                }
                            }}
                        >
                            {item.icon} {item.name}
                        </p>
                    ))}

                    <p onClick={onLogout} style={{ cursor: "pointer" }}>
                        ↪ Logout
                    </p>
                </aside>

                <main className="dashboard-content">
                    {activeMenu === "Dashboard" && (
                        <>
                            <h2>Welcome, {seller?.sellerName || "Seller"}!</h2>
                            <p>
                                Manage products, track stock, and grow your
                                business.
                            </p>

                            {renderStats()}

                            <section className="product-section">
                                <h3>Recent Products</h3>

                                {products.length === 0 ? (
                                    <p>
                                        No products added yet. Go to Products
                                        to add your first product.
                                    </p>
                                ) : (
                                    <div className="product-table-wrapper">
                                        <table className="product-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.slice(0, 5).map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.productName}</td>
                                                        <td>{item.category}</td>
                                                        <td>₹ {item.price}</td>
                                                        <td>{item.stockQuantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {activeMenu === "My Shop" && (
                        <>
                            <h2>🏪 My Shop</h2>
                            <p>Your registered shop details.</p>

                            <section className="product-section">
                                <h3>Shop Details</h3>
                                <p><strong>Shop Name:</strong> {seller?.shopName || "Not available"}</p>
                                <p><strong>Shop Owner:</strong> {seller?.sellerName || "Not available"}</p>
                                <p><strong>Mobile Number:</strong> {seller?.mobile || "Not available"}</p>
                                <p><strong>Shop Area:</strong> {seller?.area || "Not available"}</p>
                                <p><strong>City:</strong> {seller?.city || "Not available"}</p>
                                <p><strong>Seller ID:</strong> {seller?.id ?? "Not available"}</p>
                                <p><strong>Total Products:</strong> {products.length}</p>
                                <p><strong>Product Categories:</strong> {categories.length}</p>
                            </section>

                            {renderStats()}
                        </>
                    )}

                    {activeMenu === "Products" && (
                        <>
                            <h2>📦 Products</h2>
                            <p>
                                Add, search, filter, update, and delete your
                                products.
                            </p>

                            {renderProductForm()}

                            {message && <p role="status">{message}</p>}

                            {renderProductTable()}
                        </>
                    )}

                    {activeMenu === "Profile" && (
                        <>
                            <h2>👤 My Profile</h2>
                            <p>View and update your registered seller details.</p>

                            <section className="product-section">
                                <h3>Profile Information</h3>

                                {!editProfile ? (
                                    <>
                                        <p><strong>Seller Name:</strong> {seller?.sellerName || "Not available"}</p>
                                        <p><strong>Shop Name:</strong> {seller?.shopName || "Not available"}</p>
                                        <p><strong>Mobile Number:</strong> {seller?.mobile || "Not available"}</p>
                                        <p><strong>Shop Area:</strong> {seller?.area || "Not available"}</p>
                                        <p><strong>City:</strong> {seller?.city || "Not available"}</p>
                                        <p><strong>Seller ID:</strong> {seller?.id ?? "Not available"}</p>
                                        <p><strong>Account Type:</strong> Seller</p>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfile({
                                                    sellerName: seller?.sellerName || "",
                                                    shopName: seller?.shopName || "",
                                                    mobile: seller?.mobile || "",
                                                    area: seller?.area || "",
                                                    city: seller?.city || ""
                                                });
                                                setEditProfile(true);
                                                setMessage("");
                                            }}
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                ) : (
                                    <form
                                        className="product-form"
                                        onSubmit={handleProfileSave}
                                    >
                                        <label>Seller Name *</label>
                                        <input
                                            name="sellerName"
                                            value={profile.sellerName}
                                            onChange={handleProfileChange}
                                            required
                                        />

                                        <label>Shop Name *</label>
                                        <input
                                            name="shopName"
                                            value={profile.shopName}
                                            onChange={handleProfileChange}
                                            required
                                        />

                                        <label>Mobile Number *</label>
                                        <input
                                            name="mobile"
                                            type="tel"
                                            value={profile.mobile}
                                            onChange={handleProfileChange}
                                            maxLength={10}
                                            inputMode="numeric"
                                            required
                                        />

                                        <label>Shop Area *</label>
                                        <input
                                            name="area"
                                            value={profile.area}
                                            onChange={handleProfileChange}
                                            required
                                        />

                                        <label>City *</label>
                                        <input
                                            name="city"
                                            value={profile.city}
                                            onChange={handleProfileChange}
                                            required
                                        />

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                disabled={profileLoading}
                                            >
                                                {profileLoading
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>

                                            <button
                                                type="button"
                                                className="cancel-button"
                                                disabled={profileLoading}
                                                onClick={() => {
                                                    setProfile({
                                                        sellerName: seller?.sellerName || "",
                                                        shopName: seller?.shopName || "",
                                                        mobile: seller?.mobile || "",
                                                        area: seller?.area || "",
                                                        city: seller?.city || ""
                                                    });
                                                    setEditProfile(false);
                                                    setMessage("");
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {message && <p role="status">{message}</p>}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SellerDashboard;
