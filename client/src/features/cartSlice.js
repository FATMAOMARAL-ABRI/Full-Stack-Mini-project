// features/cartSlice.js
// Manages the shopping cart in Redux:
//   - Local state changes (add, increase, decrease, remove, clear)
//   - DB sync: fetchCart on login, syncCartToDB at checkout

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ── Fetch this user's saved cart from MongoDB on login / page refresh ──
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/cart/getCart/${userId}`
      );
      return res.data; // array of cart items from DB
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// ── Save the entire local cart to MongoDB (called at checkout) ──
export const syncCartToDB = createAsyncThunk(
  "cart/syncCartToDB",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3001/api/cart/sync", {
        userId,
        items,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to sync cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],       // [{ productId, name, price, quantity }]
    isLoading: false,
    error: null,
  },
  reducers: {
    // ── Add a product — bumps quantity if already present ──
    addToCart(state, action) {
      const product = action.payload; // expects { product_id, name, price }

      const existing = state.items.find(
        (item) => item.productId === product.product_id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          productId: product.product_id,
          name:      product.name,
          price:     product.price,
          quantity:  1,
        });
      }
    },

    // ── Increase quantity of one item by 1 ──
    increaseQty(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity += 1;
    },

    // ── Decrease quantity by 1; remove item when it reaches 0 ──
    decreaseQty(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },

    // ── Remove a single item entirely ──
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    // ── Wipe the whole cart (called on logout) ──
    clearCart(state) {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        // Replace local cart with the user's DB cart
        state.items     = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error     = action.payload;
        state.isLoading = false;
      })

      // syncCartToDB
      .addCase(syncCartToDB.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(syncCartToDB.fulfilled, (state) => {
        // Cart was saved; no local state change needed
        state.isLoading = false;
      })
      .addCase(syncCartToDB.rejected, (state, action) => {
        state.error     = action.payload;
        state.isLoading = false;
      });
  },
});

export const { addToCart, increaseQty, decreaseQty, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
