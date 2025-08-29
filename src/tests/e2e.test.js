import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js"; 

let studentToken, professorToken;
let studentId, professorId;
let slotId, appointmentId;

describe("College Appointment System E2E", () => {
  beforeAll(async () => {
    // Connect to a test DB
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should register Student A1", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Student A1",
      email: "a1@student.com",
      password: "123456",
      role: "student"
    });
    expect(res.statusCode).toBe(201);
    studentId = res.body.user._id;
  });

  it("should register Professor P1", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Professor P1",
      email: "p1@prof.com",
      password: "prof123",
      role: "professor"
    });
    expect(res.statusCode).toBe(201);
    professorId = res.body.user._id;
  });

  it("should login Student A1", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "a1@student.com",
      password: "123456"
    });
    expect(res.statusCode).toBe(200);
    studentToken = res.body.token;
  });

  it("should login Professor P1", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "p1@prof.com",
      password: "prof123"
    });
    expect(res.statusCode).toBe(200);
    professorToken = res.body.token;
  });

  it("Professor should add availability", async () => {
    const res = await request(app)
      .post(`/api/professors/${professorId}/availability`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        date: "2025-08-30",
        startTime: "2025-08-30T10:00:00.000Z",
        endTime: "2025-08-30T11:00:00.000Z"
      });

    expect(res.statusCode).toBe(201);
    slotId = res.body.slot._id;
  });

  it("Student should view professor availability", async () => {
    const res = await request(app)
      .get(`/api/professors/${professorId}/availability`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Student should book an appointment", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        professorId,
        slotId
      });

    expect(res.statusCode).toBe(201);
    appointmentId = res.body.appointment._id;
  });

  it("Professor should cancel the appointment", async () => {
    const res = await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment canceled");
  });

  it("Student should see canceled appointment", async () => {
    const res = await request(app)
      .get(`/api/appointments/student/${studentId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe("canceled");
  });
});
