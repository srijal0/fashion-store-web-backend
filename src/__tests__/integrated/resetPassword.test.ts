import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Reset Password Flow", () => {
  let testUserId: string;
  let resetToken: string;

  const testUser = {
    username: "resetuser",
    email: "reset@test.com",
    password: "123456",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    const res = await request(app).post("/api/auth/register").send(testUser);
    testUserId = res.body.data.id;
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
  });

  test("Forgot password sends token", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testUser.email });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reset link sent/i);

    const user = await UserModel.findById(testUserId);
    expect(user?.resetPasswordToken).toBeTruthy();
    resetToken = user!.resetPasswordToken!;
  });

  test("Reset password with valid token", async () => {
    const res = await request(app)
      .post(`/api/auth/reset-password/${resetToken}`)
      .send({ password: "newpassword123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/password updated/i);

    const user = await UserModel.findById(testUserId);
    expect(user?.resetPasswordToken).toBeNull();
  });

  test("Reset password with invalid token fails", async () => {
    const res = await request(app)
      .post(`/api/auth/reset-password/invalidtoken`)
      .send({ password: "anything" });

    expect(res.status).toBe(400);
  });
});
