import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from "/src/features/authSlice";

export default function Header() {
  const { role, userName } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand py-3" style={{ width: '100%', backgroundColor: '#dcd0af', fontSize: '1.6rem' }}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-2" to="/" style={{ color: 'hsl(30, 52%, 56%)' }}>
          CALO
        </Link>

        {/* Toggler for mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Centered Navigation Links */}
          <ul className="navbar-nav mx-auto gap-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-bold text-dark" to="/">Our Story</Link>
            </li>
            
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-dark" to="/alist">Admin List</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-dark" to="/add-product">Add Product</Link>
                </li>
              </>
            )}

            {role === "customer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-dark" to="/clist">Snacks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-dark" to="/cart">Cart</Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Side: Auth Zone */}
          <div className="d-flex align-items-center gap-3">
            {role ? (
              <>
                <span className="badge rounded-pill text-dark py-2 px-3" style={{ backgroundColor: '#FAD7A0' }}>
                  Hi, {userName || role}
                </span>
                <button onClick={handleLogout} className="btn btn-outline-dark rounded-pill px-4 fw-bold border-2">
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="btn rounded-pill px-4 py-2 fw-bold shadow-sm"
                style={{ backgroundColor: '#E6C097', color: '#4A2B4D' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}