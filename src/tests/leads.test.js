// src/tests/lead.test.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../server.js"; // Express app
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Lead from "../models/Lead.js";
import jwt from "jsonwebtoken";

let mongoServer;
let adminToken, userToken;
let customerId;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin user
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "hashedpassword", // we can bypass hash for tests
    role: "admin"
  });
  adminToken = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET);

  // Create normal user
  const user = await User.create({
    name: "User",
    email: "user@test.com",
    password: "hashedpassword",
    role: "user"
  });
  userToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);

  // Create a customer for testing leads
  const customer = await Customer.create({
    name: "Test Customer",
    email: "customer@test.com",
    ownerId: admin._id
  });
  customerId = customer._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Lead.deleteMany(); // clear leads after each test
});

describe("Leads API", () => {
  it("should create a lead as admin", async () => {
    const res = await request(app)
      .post(`/api/leads/${customerId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "New Lead", description: "Lead description", status: "New", value: 1000 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("New Lead");
  });

  it("should create a lead as owner", async () => {
    const res = await request(app)
      .post(`/api/leads/${customerId}`)
      .set("Authorization", `Bearer ${adminToken}`) // admin is also owner
      .send({ title: "Owner Lead" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Owner Lead");
  });

  it("should fail if user is not owner or admin", async () => {
    const res = await request(app)
      .post(`/api/leads/${customerId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Invalid Lead" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("should fetch all leads for a customer", async () => {
    await Lead.create({ customerId, title: "Lead1", status: "New" });
    await Lead.create({ customerId, title: "Lead2", status: "Contacted" });

    const res = await request(app)
      .get(`/api/leads/${customerId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should update a lead", async () => {
    const lead = await Lead.create({ customerId, title: "Old Title" });
    const res = await request(app)
      .put(`/api/leads/lead/${lead._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  it("should delete a lead", async () => {
    const lead = await Lead.create({ customerId, title: "To be deleted" });
    const res = await request(app)
      .delete(`/api/leads/lead/${lead._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Lead deleted successfully");
  });
});
