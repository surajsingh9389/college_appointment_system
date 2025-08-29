import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/route.js";
import connectDB from "./config/connectDB.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Starting Point
app.use("/api", router);

// Checking root rounte
app.get('/', (req, res) => {
    res.send('backend working......');
});

// Start server and connect to MongoDB
app.listen(port, () => {
    console.log("Server running on port 5000");
    connectDB();
});

export default app;
