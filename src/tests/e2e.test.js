import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";

let student1Token, student2Token, professorToken;
let student1Id, student2Id, professorId;
let slot1Id, slot2Id, appointment1Id, appointment2Id;

describe("College Appointment System E2E", () => {
  beforeAll(async () => {
    // Connect to a test DB
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Student A1 Register to access the system", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Student A1",
      email: "a1@student.com",
      password: "123456",
      role: "student",
    });
    expect(res.statusCode).toBe(201);
    student1Id = res.body.user._id;
  });

  it("Professor P1 Register to access the system", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Professor P1",
      email: "p1@prof.com",
      password: "prof123",
      role: "professor",
    });
    expect(res.statusCode).toBe(201);
    professorId = res.body.user._id;
  });

  it("Student A1 login to access the system.", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "a1@student.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    student1Token = res.body.token;
  });

  it("Professor P1 login to access the system", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "p1@prof.com",
      password: "prof123",
    });
    expect(res.statusCode).toBe(200);
    professorToken = res.body.token;
  });

  it("Professor P1 specifies which time slots he is free for appointments.", async () => {
    const res = await request(app)
      .post(`/api/professors/${professorId}/availability`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        date: "2025-08-30",
        startTime: "2025-08-30T10:00:00.000Z",
        endTime: "2025-08-30T11:00:00.000Z",
      });

    expect(res.statusCode).toBe(201);
    slot1Id = res.body.slot._id;
  });

  it("Professor P1 specifies which time slots he is free for appointments.", async () => {
    const res = await request(app)
      .post(`/api/professors/${professorId}/availability`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        date: "2025-08-31",
        startTime: "2025-08-31T10:00:00.000Z",
        endTime: "2025-08-31T11:00:00.000Z",
      });

    expect(res.statusCode).toBe(201);
    slot2Id = res.body.slot._id;
  });

  it("Student A1 views available time slots for Professor P1.", async () => {
    const res = await request(app)
      .get(`/api/professors/${professorId}/availability`)
      .set("Authorization", `Bearer ${student1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Student A1 books an appointment with Professor P1 for time T1.", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${student1Token}`)
      .send({
        professorId,
        slotId:slot1Id,
      });

    expect(res.statusCode).toBe(201);
    appointment1Id = res.body.appointment._id;
  });

  it("Student A2 Register to access the system", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Student A2",
      email: "a2@student.com",
      password: "123456",
      role: "student",
    });
    expect(res.statusCode).toBe(201);
    student2Id = res.body.user._id;
  });

  it("Student A2 login to access the system.", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "a2@student.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    student2Token = res.body.token;
  });

  it("Student A2 books an appointment with Professor P1 for time T1.", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${student2Token}`)
      .send({
        professorId,
        slotId:slot2Id,
      });

    expect(res.statusCode).toBe(201);
    appointment2Id = res.body.appointment._id;
  });

  it("Professor should cancel the appointment", async () => {
    const res = await request(app)
      .delete(`/api/appointments/${appointment1Id}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment canceled");
  });

  it("Student A1 should see canceled appointment", async () => {
    const res = await request(app)
      .get(`/api/appointments/student/${student1Id}`)
      .set("Authorization", `Bearer ${student1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe("canceled");
  });
});
