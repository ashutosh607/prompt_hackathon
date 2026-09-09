const { supabase, supabaseAdmin, testSupabaseConnection } = require("../config/supabase");

// Health check endpoint
const checkHealth = async (req, res) => {
  try {
    const supabaseHealth = await testSupabaseConnection();

    return res.status(200).json({
      status: "online",
      serverTime: new Date().toISOString(),
      supabase: supabaseHealth,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

// Retrieve items from Supabase database
const getItems = async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Check if table hasn't been created yet in Supabase
      if (
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message.includes("schema cache") ||
        error.message.includes("does not exist") ||
        error.message.includes("relation")
      ) {
        return res.status(200).json({
          success: true,
          tableReady: false,
          items: [],
          message: "The 'items' table has not been created in Supabase yet. Run the SQL script from 'backend/database/schema.sql' in your Supabase SQL Editor.",
        });
      }

      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      tableReady: true,
      items: data || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a new item in Supabase database
const createItem = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("items")
      .insert([
        {
          title: title.trim(),
          description: description ? description.trim() : "",
          status: status || "pending",
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      item: data?.[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  checkHealth,
  getItems,
  createItem,
};
