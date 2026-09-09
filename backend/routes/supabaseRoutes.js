const express = require("express");
const router = express.Router();
const {
  checkHealth,
  getItems,
  createItem,
} = require("../controllers/supabaseController");

// System and Supabase health check
router.get("/health", checkHealth);

// Sample database CRUD routes using Supabase
router.get("/items", getItems);
router.post("/items", createItem);

module.exports = router;
