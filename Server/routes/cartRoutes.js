// server/routes/cartRoutes.js
// Handles cart persistence in MongoDB.
// GET  /getCart/:userId → fetch this user's saved cart items
// POST /sync            → replace the user's cart with the current local state (called at checkout)

import express  from "express";
import CartModel from "../models/cart.js";

const router = express.Router();

// ── GET: load a user's cart from DB (called on login / page refresh) ──
router.get("/getCart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await CartModel.find({ userId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST: sync (overwrite) a user's entire cart ──
// Deletes all existing rows for this user, then inserts the new batch.
// Called once at checkout so the DB always reflects the latest cart state.
router.post("/sync", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Remove all previous cart rows for this user
    await CartModel.deleteMany({ userId });

    // Insert the current items (skip if cart is empty)
    if (items.length > 0) {
      const cartItems = items.map((item) => ({
        userId,
        productId: item.productId,
        name:      item.name,
        price:     item.price,
        quantity:  item.quantity,
      }));

      await CartModel.insertMany(cartItems);
    }

    res.status(200).json({ message: "Cart saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
