// components/admin/ProductRegister.jsx
// Admin form to add a brand-new product.
// Sends a POST request to /api/product/addProduct.
// On success, navigates back to the admin product list.

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductRegister = () => {
  // Controlled form state
  const [formData, setFormData] = useState({
    product_id:   "",
    name:         "",
    price:        "",
    stock:        "",
    picture_link: "",
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ── Keep formData in sync with inputs ──
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPictureFile(e.target.files[0] || null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setPictureFile(file);
    }
  };

  // ── Submit: POST new product to backend ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let pictureLink = formData.picture_link;

      if (pictureFile) {
        const uploadData = new FormData();
        uploadData.append("image", pictureFile);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/product/uploadImage`,
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        pictureLink = uploadRes.data.picture_link;
      }

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/product/addProduct`, {
        product_id:   Number(formData.product_id),
        name:         formData.name,
        price:        Number(formData.price),
        stock:        Number(formData.stock),
        picture_link: pictureLink,
      });

      setSuccess("Product added successfully!");

      // Redirect to admin product list after a short delay
      setTimeout(() => navigate("/alist"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Add New Product</h2>

      {error   && <p className="text-danger fw-bold">{error}</p>}
      {success && <p className="text-success fw-bold">{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Product ID */}
        <div className="mb-3">
          <label className="form-label">Product ID</label>
          <input
            type="number"
            name="product_id"
            className="form-control"
            value={formData.product_id}
            onChange={handleChange}
            required
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        {/* Picture upload */}
        <div
          className={`mb-3 p-3 border rounded ${dragActive ? "border-primary bg-light" : "border-secondary"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ minHeight: "140px", cursor: "pointer" }}
        >
          <label className="form-label d-block mb-2">Upload Picture</label>
          <input
            type="file"
            name="picture"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
          <div className="mt-2">
            <small className="text-muted">
              Drag an image file here, or click to browse.
            </small>
          </div>
          {pictureFile && (
            <p className="mt-2 mb-0">Selected file: {pictureFile.name}</p>
          )}
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Saving…" : "Add Product"}
          </button>

          {/* Cancel: go back without saving */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/alist")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegister;
