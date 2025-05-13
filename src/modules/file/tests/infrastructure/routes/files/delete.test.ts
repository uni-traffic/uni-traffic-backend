import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";

describe("POST api/v1/files/delete", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  it("should return 200 status code when successfully upload the file", async () => {
    const authenticationToken = "uni-traffic-2025";

    const response = await requestAPI
      .post("/api/v1/files/delete")
      .set("Authorization", `Bearer ${authenticationToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
  });
});
