import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login }               from "./features/authSlice";
import { fetchCart, clearCart } from "./features/cartSlice";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const user   = result.payload.user;
      const userId = user._id;

      // Step 1: wipe previous user's cart so carts don't bleed between accounts
      dispatch(clearCart());

      // Step 2: load this user's saved cart from MongoDB
      dispatch(fetchCart(userId));

      // Step 3: send to the correct dashboard
      if (user.role === "admin") {
        navigate("/alist");
      } else {
        navigate("/clist");
      }
    } else {
      // Error is already stored in Redux; the JSX below will display it
      console.error("Login failed:", result.payload);
    }
  };

  return (
    <div className="container-fluid  p-5">
      <div className="row h-100">

        {/* ── Left: Login Form ── */}
        <div className="col-lg-5 d-flex align-items-center justify-content-center">
          <div className="calo-card p-5 shadow-sm">

            <h2
              className="text-center fw-bold mb-4"
              style={{ color: "#4A2B4D", fontSize: "2.5rem" }}
            >
              Sign In
            </h2>

            <form>
              {/* Email field */}
              <div className="mb-4">
                <label className="form-label fw-bold ps-3" style={{ color: "#4A2B4D" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control calo-input"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="mb-4">
                <label className="form-label fw-bold ps-3" style={{ color: "#4A2B4D" }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control calo-input"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Show server/validation error */}
              {error && (
                <p className="text-danger text-center fw-bold">{error}</p>
              )}

              {/* Submit */}
              <div className="d-flex justify-content-center mt-2">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="btn calo-btn px-5 py-2 fw-bold"
                >
                  Login
                </button>
              </div>

              {/* Link to registration */}
              <div className="text-center mt-4">
                <span style={{ color: "#4A2B4D" }}>Not Registered? </span>
                <Link to="/register" className="fw-bold" style={{ color: "#4A2B4D" }}>
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* ── Right: Decorative Image ── */}
        <div className="col-lg-4 d-none d-lg-flex align-items-center justify-content-center p-5 calo-side-img">
          <div className="shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: "420px", width: "100%" }}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/login.PNG`}
              alt="Calo"
              className="img-fluid"
              style={{ width: "100%", maxHeight: "560px", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
