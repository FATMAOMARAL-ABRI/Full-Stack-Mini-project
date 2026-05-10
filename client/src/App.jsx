import { Routes, Route } from "react-router-dom";
import ProductListAdmin    from "./components/admin/ProductListAdmin";
import ProductListCustomer from "./components/customer/ProductListCustomer";
import ProductRegister     from "./components/admin/ProductRegister";
import ProductEdit         from "./components/admin/Productedit.jsx";   
import Cart                from "./components/customer/Cart";
import Header              from "./Header";
import CustomerRegister    from "./components/customer/CustomerRegister";
import Login               from "./Login.jsx";
import OurStory            from "./OurStory";
import ProtectedRoute      from "./ProtectedRoute";

function App() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Header />

      <div style={{ flex: 1, width: "90%" }}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"         element={<OurStory />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<CustomerRegister />} />

          {/* ── Customer Routes ── */}
          <Route path="/clist" element={<ProductListCustomer />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles="customer">
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* ── Admin Routes ── */}
          <Route
            path="/alist"
            element={
              <ProtectedRoute allowedRoles="admin">
                <ProductListAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <ProtectedRoute allowedRoles="admin">
                <ProductRegister />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute allowedRoles="admin">
                <ProductEdit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;