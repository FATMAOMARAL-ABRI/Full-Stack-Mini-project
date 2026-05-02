// components/admin/ProductListAdmin.jsx
// Admin-only view of all products.
// Each row has an "Edit" button that navigates to /edit-product/:id
// so the admin can update name, price, stock, or image.

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const navigate = useNavigate();

  // ── Load all products on mount ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/product/getAllProducts"
        );
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading products…</p>;
  if (error)   return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>
        {/* Navigate to the Add Product form */}
        <button
          className="btn btn-success"
          onClick={() => navigate("/add-product")}
        >
          + Add New Product
        </button>
      </div>

      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} >
              <td>{product.product_id}</td>

              {/* Thumbnail */}
              <td>
                <img
                  src={product.picture_link}
                  alt={product.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              </td>

              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>

              {/* Edit / Delete buttons */}
              <td className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/edit-product/${product.product_id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    if (!window.confirm("Delete this product?")) return;

                    try {
                      await axios.delete(
                        `${import.meta.env.VITE_SERVER_URL}/api/product/deleteProduct/${product.product_id}`
                      );
                      setProducts((prev) =>
                        prev.filter((item) => item.product_id !== product.product_id)
                      );
                    } catch (err) {
                      setError("Failed to delete product.");
                    }
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListAdmin;
