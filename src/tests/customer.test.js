import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js"; // Your Express app
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";

let mongoServer;
let token;

// Setup in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Create a test admin user
  const adminUser = new User({
    name: "Admin",
    email: "admin@test.com",
    password: "hashedpassword", // hash not required for test
    role: "admin",
  });
  await adminUser.save();

  // Generate JWT token for admin
  token = jwt.sign(
    { id: adminUser._id, email: adminUser.email, role: "admin" },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );
});

// Clean DB after each test
afterEach(async () => {
  await Customer.deleteMany();
});

// Stop MongoDB
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/customers", () => {
  it("should create a new customer when admin", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Customer",
        email: "testcustomer@example.com",
        phone: "1234567890",
        company: "Test Company",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Customer");
    expect(res.body.email).toBe("testcustomer@example.com");

    const customerInDb = await Customer.findOne({ email: "testcustomer@example.com" });
    expect(customerInDb).not.toBeNull();
  });

  it("should fail if name or email missing", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "1234567890" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/);
  });

  it("should fail if user is not admin", async () => {
    const normalUser = new User({
      name: "User",
      email: "user@test.com",
      password: "hashedpassword",
      role: "user",
    });
    await normalUser.save();

    const userToken = jwt.sign(
      { id: normalUser._id, email: normalUser.email, role: "user" },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Customer",
        email: "customer@test.com",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Admin access required");
  });
});
