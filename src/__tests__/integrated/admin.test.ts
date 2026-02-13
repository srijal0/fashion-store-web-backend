import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcrypt";

let adminToken: string;
let userId: string;

// Admin user payload
const adminUser = {
  username: "adminuser",
  email: "admin@test.com",
  password: "123456",
  role: "admin",
};

// Test user payload
const testUser = {
  username: "testuser",
  email: "testuser@test.com",
  password: "password123",
  confirmPassword: "password123",
  firstName: "Test",
  lastName: "User",
};

describe("Admin Routes", () => {
  beforeAll(async () => {
    // Clear users
    await UserModel.deleteMany({});

    // Create admin directly in DB
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await UserModel.create({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      role: "admin",
    });

    // Login admin to get JWT
    const res = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });

    if (!res.body.token) {
      console.error("Admin login failed:", res.body);
    }
    adminToken = res.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  it("Admin can create a new user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    userId = res.body.data.id; // Save for later tests
  });

  it("Admin can get all users with pagination", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination.totalUsers).toBeGreaterThan(0);
  });

  it("Admin can get a single user by ID", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("username", testUser.username);
  });

  it("Admin can update a user", async () => {
    const res = await request(app)
      .put(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ firstName: "Updated", lastName: "Name" });

    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe("Updated");
  });

  it("Admin cannot delete self", async () => {
    const admin = await UserModel.findOne({ email: adminUser.email });

    const res = await request(app)
      .delete(`/api/admin/users/${admin?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You cannot delete your own account");
  });

  it("Admin can delete a user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
