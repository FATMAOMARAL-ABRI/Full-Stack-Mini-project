import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  syncCartToDB,
  increaseQty,
  decreaseQty,
  removeItem,
} from "../../features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const [receipt, setReceipt] = useState(null);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const receiptRef = useRef(null);

  // Get the logged-in user's ID and their cart from Redux
  const { userId }                  = useSelector((state) => state.auth);
  const { items, isLoading, error } = useSelector((state) => state.cart);

  // Running total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ── Local-only handlers (no DB call) ──
  const handleIncrease = (productId) => dispatch(increaseQty(productId));
  const handleDecrease = (productId) => dispatch(decreaseQty(productId));
  const handleRemove   = (productId) => dispatch(removeItem(productId));

  // ── Checkout: save entire cart to MongoDB ──
  const handleCheckout = () => {
    dispatch(syncCartToDB({ userId, items }))
      .unwrap()
      .then(() => {
        setReceipt({
          items: [...items],
          total,
          timestamp: new Date().toLocaleString(),
        });
      })
      .catch(() => {
        setReceipt(null);
      });
  };

  const handleSaveReceiptPdf = async () => {
    if (!receiptRef.current) return;

    setIsSavingPdf(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("receipt.pdf");
    } catch (err) {
      console.error("Failed to save receipt PDF", err);
    } finally {
      setIsSavingPdf(false);
    }
  };

  // ── Empty cart state ──
  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Your Cart</h2>
        <p className="text-muted">Your cart is empty. Go add some snacks!</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Cart</h2>

      {/* Show any sync errors */}
      {error && <p className="text-danger fw-bold">{error}</p>}

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.productId}>
              {/* Product name */}
              <td>{item.name}</td>

              {/* Unit price */}
              <td>${item.price.toFixed(2)}</td>

              {/* Quantity controls */}
              <td>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleDecrease(item.productId)}
                  >
                   
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleIncrease(item.productId)}
                  >
                    +
                  </button>
                </div>
              </td>

              {/* Row total */}
              <td>${(item.price * item.quantity).toFixed(2)}</td>

              {/* Remove row */}
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(item.productId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={3}>
              <strong>Total</strong>
            </td>
            <td colSpan={2}>
              <strong>${total.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Checkout button */}
      <div className="text-end mt-3">
        <button
          className="btn btn-success mt-2"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Saving…" : "Proceed to Checkout"}
        </button>
      </div>

      {/* Receipt shown after successful checkout */}
      {receipt && (
        <div className="card shadow-sm mt-4 receipt-print-area" ref={receiptRef}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="card-title">Receipt</h4>
                <p className="text-muted mb-0">Saved on {receipt.timestamp}</p>
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={handleSaveReceiptPdf}
                disabled={isSavingPdf}
              >
                {isSavingPdf ? "Saving PDF…" : "Save Receipt PDF"}
              </button>
            </div>
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-end fw-bold">
                    Total
                  </td>
                  <td className="fw-bold">${receipt.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;