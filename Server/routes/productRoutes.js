// server/routes/productRoutes.js
// Handles all product-related HTTP endpoints.
// GET  /getAllProducts     → returns all products (used by both admin and customer views)
// GET  /getProduct/:id    → returns a single product by product_id (used by Edit form)
// POST /addProduct        → admin creates a new product
// PUT  /updateProduct/:id → admin updates an existing product

import express from "express";
import fs from "fs";
import Product from "../models/product.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${suffix}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// ── Upload a product image ──
router.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  return res.status(201).json({ picture_link: imageUrl });
});

// ── GET all products ──
router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET single product by product_id ──
router.get("/getProduct/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      product_id: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST add new product ──
router.post("/addProduct", async (req, res) => {
  try {
    const { product_id, name, price, stock, picture_link } = req.body;

    // Check for duplicate product_id
    const existing = await Product.findOne({ product_id });
    if (existing) {
      return res.status(400).json({ message: "Product ID already exists" });
    }

    const newProduct = new Product({ product_id, name, price, stock, picture_link });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── PUT update existing product by product_id ──
router.put("/updateProduct/:id", async (req, res) => {
  try {
    const { name, price, stock, picture_link } = req.body;

    const updated = await Product.findOneAndUpdate(
      { product_id: Number(req.params.id) }, // filter
      { name, price, stock, picture_link },   // fields to update
      { new: true }                           // return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE remove existing product by product_id ──
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      product_id: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageFile = path.basename(product.picture_link || "");
    const imagePath = path.join(__dirname, "../uploads", imageFile);

    if (imageFile && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
