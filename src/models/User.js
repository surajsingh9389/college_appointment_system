import mongoose from "mongoose";

// Define schema for User collection
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true // Every user must have a name
  },
  email: { 
    type: String, 
    unique: true, // Prevents duplicate emails
    required: true 
  },
  password: { 
    type: String, 
    required: true // Will store hashed password, not plain text
  },
  role: { 
    type: String, 
    enum: ["student", "professor"], // Only allow these roles
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically set creation time
  }
});

// Create User model based on schema
export const User = mongoose.model("User", userSchema);
