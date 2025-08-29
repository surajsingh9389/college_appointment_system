import mongoose from "mongoose";

// Define schema for appointments between students and professors
const appointmentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Reference to student user
    required: true 
  },
  professorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Reference to professor user
    required: true 
  },
  slotId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Availability", // Reference to chosen availability slot
    required: true 
  },
  status: { 
    type: String, 
    enum: ["booked", "canceled"], 
    default: "booked" // New appointments are booked by default
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Auto-set creation time
  }
});

// Create Appointment model
export const Appointment = mongoose.model("Appointment", appointmentSchema);
