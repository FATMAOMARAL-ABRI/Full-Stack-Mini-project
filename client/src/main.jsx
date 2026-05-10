import { StrictMode }  from "react";
import { createRoot }  from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider }    from "react-redux";
import { store }       from "./store/store";

import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
  </BrowserRouter>
);