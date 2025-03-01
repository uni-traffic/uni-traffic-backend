import request, { SuperTest, Test } from "supertest"; 
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedVehicle } from "../../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../../violation/tests/utils/violation/seedViolation";

describe("POST /api/v1/violation-record/create", () => {
    let requestAPI: SuperTest<Test>;
    let vehicleId: string;
    let ownerId: string;  
    let violationId: string;
    beforeAll(() => {
        requestAPI = request.agent(app) as unknown as SuperTest<Test>;
    });    

    beforeEach(async () => {
        await db.violationRecord.deleteMany();
        await db.user.deleteMany();
        const user = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
        ownerId = user.id;  
        const vehicle = await seedVehicle({ ownerId });
        vehicleId = vehicle.id;
        const violation = await seedViolation();
         violationId = violation.id;
    });

    it("should create a new violation record with valid security role", async () => {
        const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });
        const reporterId = reporter.id;
        const payload = {
        userId: ownerId,
        vehicleId: vehicleId,
        violationId: violationId,
        reportedById: reporterId
        };
        const response = await requestAPI
        .post("/api/v1/violation-record/create")
       .set("Authorization", `Bearer ${reporter.accessToken}`)
       .send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("should return 403 Forbidden if user does not have the SECURITY role", async () => {
        const reporter = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
        const reporterId = reporter.id;
        const payload = {
        userId: ownerId,
        vehicleId: vehicleId,
        violationId: violationId,
        reportedById: reporterId
        };
        const response = await requestAPI
        .post("/api/v1/violation-record/create")
        .set("Authorization", `Bearer ${reporter.accessToken}`)
        .send(payload);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("You do not have the required permissions to perform this action.");
    });

    it("should return 401 Unauthorized if no token is provided", async () => {
        const payload = {
            userId: "ownerId",
            vehicleId: "vehicleId",
            violationId: "violationId",
            reportedById: "reporterId"
        };
        const response = await requestAPI
        .post("/api/v1/violation-record/create")
        .send(payload);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access token is required "Bearer {token}"');
        });
});