import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  addAvailability,
  getAvailability,
  cancelAppointment,
} from "../controllers/professorController.js";
import {
  bookAppointment,
  getStudentAppointments,
  getProfessorAppointments,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// AUTH ROUTES
// Register a new user (student/professor)
router.post("/auth/register", registerUser);

// Login user and return JWT token
router.post("/auth/login", loginUser);



// PROFESSOR ROUTES
// Add professor availability (only professors can access)
router.post(
  "/professors/:id/availability",
  authMiddleware("professor"),
  addAvailability
);

// Get availability of a professor (students & professors can access)
router.get(
  "/professors/:id/availability",
  authMiddleware(["student", "professor"]),
  getAvailability
);

// Cancel an appointment (only professors can cancel)
router.delete(
  "/appointments/:id",
  authMiddleware("professor"),
  cancelAppointment
);



// STUDENT ROUTES
// Book an appointment with a professor (only students)
router.post("/appointments", authMiddleware("student"), bookAppointment);

// Get all appointments for a student
router.get(
  "/appointments/student/:id",
  authMiddleware("student"),
  getStudentAppointments
);

// Get all appointments with a professor (for professors only)
router.get(
  "/appointments/professor/:id",
  authMiddleware("professor"),
  getProfessorAppointments
);

export default router;
