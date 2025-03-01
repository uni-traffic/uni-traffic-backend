import request, { SuperTest, Test } from "supertest"; 
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { faker } from "@faker-js/faker";
import { seedVehicle } from "../../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../../violation/tests/utils/violation/seedViolation";

describe("POST /api/v1/violation-record", () => {
    let requestAPI: SuperTest<Test>;
    let vehicleId: string;
    let ownerId: string;  
    let violationId: string;
    beforeAll(async () => {
        requestAPI = request.agent(app) as unknown as SuperTest<Test>;
        const user = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
        ownerId = user.id;  
        const vehicle = await seedVehicle({ ownerId });
        vehicleId = vehicle.id;
        const violation = await seedViolation();
         violationId = violation.id;
    });    

    beforeEach(async () => {
        await db.violationRecord.deleteMany();
    });

    it("should create a new violation record with valid security role", async () => {
        const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });
        const payload = {
        userId: ownerId,
        vehicleId: vehicleId,
        violationId: violationId,
        };
        const response = await requestAPI
        .post("/api/v1/violation-record")
       .set("Authorization", `Bearer ${reporter.accessToken}`)
       .send(payload);
        console.log("response ", response.status, response.body)
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("should return 403 Forbidden if user does not have the SECURITY role", async () => {
        const user = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
        const payload = {
        userId: ownerId,
        vehicleId: vehicleId,
        violationId: violationId,
        };

        const response = await requestAPI
        .post("/api/v1/violation-record")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send(payload);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("You do not have the required permissions to perform this action.");
    });

    it("should return 401 Unauthorized if no token is provided", async () => {
        const response = await requestAPI.post("/api/v1/violation-record").send({
        userId: "test-user-id",
        vehicleId: "test-vehicle-id",
        violationId: "test-violation-id",
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access token is required "Bearer {token}"');
        });
});