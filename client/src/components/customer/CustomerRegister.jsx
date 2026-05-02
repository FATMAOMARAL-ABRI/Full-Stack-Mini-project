import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CustomerRegister() {

  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
//the role is automatically set to "customer" when registering, so we don't need a separate state for it.
  const registerCustomer = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/register`, {
        userName,
        email,
        phoneno,
        password,
        role: "customer",
        
      });

      setMsg(res.data.message);
      setIsRegistered(true);
    } catch (error) {
      setMsg(error.response?.data?.message || "Something went wrong");
      setIsRegistered(false);
    }
  };

  return (
    <div className="container-fluid p-5">
      <div className="row h-100">

        <div className="col-lg-5 d-flex align-items-center justify-content-center">
          <div className="calo-card p-5 shadow-sm">
            <h2
              className="text-center fw-bold mb-4"
              style={{ color: "#4A2B4D", fontSize: "2.5rem" }}
            >
              Sign Up
            </h2>

            <form>
              <div className="mb-4">
                <label className="form-label fw-bold ps-3" style={{ color: "#4A2B4D" }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  className="form-control calo-input"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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

              <div className="mb-4">
                <label className="form-label fw-bold ps-3" style={{ color: "#4A2B4D" }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control calo-input"
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhoneno(e.target.value)}
                />
              </div>

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

              {msg && (
                <p className={`text-center fw-bold ${isRegistered ? "text-success" : "text-danger"}`}>
                  {msg}
                </p>
              )}

              <div className="d-flex justify-content-center mt-2">
                <button
                  type="button"
                  onClick={registerCustomer}
                  className="btn calo-btn px-5 py-2 fw-bold"
                >
                  Register
                </button>
              </div>

              <div className="text-center mt-4">
                <span style={{ color: "#4A2B4D" }}>
                  Already have an account?
                </span>
                <Link to="/login" className="fw-bold" style={{ color: "#4A2B4D", marginLeft: "6px" }}>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>

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

export default CustomerRegister;