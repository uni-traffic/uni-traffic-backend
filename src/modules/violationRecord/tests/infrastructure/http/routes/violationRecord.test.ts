    import request, { SuperTest, Test } from "supertest"; 
    import app from "../../../../../../../api";
    import { db } from "../../../../../../shared/infrastructure/database/prisma";
    import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
    import { faker } from "@faker-js/faker";

    describe("POST /api/v1/violation-record", () => {
        let requestAPI: SuperTest<Test>;
        let vehicleId: string;
        let ownerId: string;  
        let violationId: string;
        beforeAll(async () => {
            requestAPI = request.agent(app) as unknown as SuperTest<Test>;

            const user = await db.user.create({
                data: {
                    id: faker.string.uuid(),
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    password: faker.internet.password(), 
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    role: "STUDENT",
                },
            });
            ownerId = user.id;  
    
            const vehicle = await db.vehicle.create({
                data: {
                    id: faker.string.uuid(),
                    ownerId: ownerId,
                    licensePlate: faker.vehicle.vrm().toUpperCase(),
                    make: faker.vehicle.manufacturer(),
                    model: faker.vehicle.model(),
                    series: faker.vehicle.type(),
                    color: faker.color.human(),
                    stickerNumber: faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
                    isActive: faker.datatype.boolean(),
                    type: faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]),
                    images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
                    faker.image.url()
                    ),
                },
            });
            vehicleId = vehicle.id;

            const violation = await db.violation.create({
                data: {
                    id: faker.string.uuid(),
                    category: faker.helpers.arrayElement(["A", "B", "C"]),
                    violationName: faker.lorem.words(3),
                    penalty: faker.number.int({ min: 100, max: 1000 })
                }
            }); 
            violationId = violation.id;
        });    

        beforeEach(async () => {
            await db.violationRecord.deleteMany();
        });

        it("should create a new violation record with valid security role", async () => {
            const user = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });

            const payload = {
            userId: user.id,
            vehicleId: vehicleId,
            violationId: violationId,
            };

            const response = await requestAPI
            .post("/api/v1/violation-record")
            .set("Authorization", `Bearer ${user.accessToken}`)
            .send(payload);
            console.log("response ", response.status, response.body)
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
        });

        it("should return 403 Forbidden if user does not have the SECURITY role", async () => {
            const user = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });

            const payload = {
            userId: user.id,
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