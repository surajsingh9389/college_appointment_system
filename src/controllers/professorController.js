import { Availability } from "../models/Availability.js";
import { Appointment } from "../models/Appointment.js";

// Professors add availability slots
export const addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    const slot = new Availability({
      professorId: req.user._id, // logged-in professor
      date,
      startTime,
      endTime
    });

    await slot.save();
    res.status(201).json({ message: "Availability added", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch available slots for a professor
export const getAvailability = async (req, res) => {
  try {
    const { id } = req.params; // professorId
    const slots = await Availability.find({ professorId: id, isBooked: false });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Professors cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params; // appointmentId

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Ensure professor owns the appointment
    if (appointment.professorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    // Update appointment + availability slot
    appointment.status = "canceled";
    await appointment.save();
    await Availability.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.json({ message: "Appointment canceled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
