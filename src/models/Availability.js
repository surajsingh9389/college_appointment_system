import mongoose from "mongoose";

// Define schema for professor availability
const availabilitySchema = new mongoose.Schema({
  professorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Reference to professor in User collection
    required: true 
  },
  date: { 
    type: Date, 
    required: true // The day of availability
  },
  startTime: { 
    type: Date, 
    required: true // When the slot starts
  },
  endTime: { 
    type: Date, 
    required: true // When the slot ends
  },
  isBooked: { 
    type: Boolean, 
    default: false // Initially free until a student books
  }
});

// Create Availability model
export const Availability = mongoose.model("Availability", availabilitySchema);
