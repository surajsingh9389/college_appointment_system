import { Availability } from "../models/Availability.js";
import { Appointment } from "../models/Appointment.js";

// Students book an appointment with a professor
export const bookAppointment = async (req, res) => {
  try {
    const { professorId, slotId } = req.body;

    // Check if slot exists and is free
    const slot = await Availability.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: "Slot not available" });
    }

    //Checking for Professor who add the slot
    if(slot.professorId != professorId){
      return res.status(400).json({message: "Invalid Slot"})
    }

    // Create appointment
    const appointment = new Appointment({
      studentId: req.user._id,
      professorId,
      slotId
    });

    await appointment.save();

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Students fetch their appointments
export const getStudentAppointments = async (req, res) => {
  try {
    const { id } = req.params; // studentId
    const appointments = await Appointment.find({ studentId: id })
      .populate("professorId", "name email") // show professor details
      .populate("slotId"); // show slot details
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Professors fetch all their appointments
export const getProfessorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // professorId
    const appointments = await Appointment.find({ professorId: id })
      .populate("studentId", "name email") // show student details
      .populate("slotId"); // show slot details
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
