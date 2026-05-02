import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductListCustomer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Track which product was just added (for brief visual feedback)
  const [addedId, setAddedId] = useState(null);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { userId } = useSelector((state) => state.auth); // null if not logged in

  // ── Fetch all products from the backend on mount ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/product/getAllProducts`
        );
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ── Add product to the logged-in customer's cart ──
  const handleAddToCart = (product) => {
    if (!userId) {
      // Guest user: redirect to login first
      navigate("/login");
      return;
    }

    dispatch(addToCart(product)); // adds to Redux state (isolated per user session)

    // Brief "Added!" feedback on the button
    setAddedId(product.product_id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // ── Loading / error states ──
  if (loading) return <p className="text-center mt-5">Loading snacks…</p>;
  if (error)   return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Our Snacks</h2>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div
                className="card-img-top"
                style={{
                  height: "220px",
                  backgroundImage: `url(${product.picture_link})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#f8f9fa",
                }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">${product.price.toFixed(2)}</p>

                {/* Stock indicator */}
                {product.stock > 0 ? (
                  <span className="badge bg-purple mb-2">In Stock</span>
                ) : (
                  <span className="badge bg-secondary mb-2">Out of Stock</span>
                )}

                {/* Add to cart — disabled when out of stock */}
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {addedId === product.product_id ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListCustomer;
