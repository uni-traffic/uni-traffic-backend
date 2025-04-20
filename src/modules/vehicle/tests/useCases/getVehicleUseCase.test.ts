import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetVehicleUseCase } from "../../src/useCases/getVehicleUseCase";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

describe("GetVehicleUseCase", () => {
  let getVehicleUseCase: GetVehicleUseCase;

  beforeAll(() => {
    getVehicleUseCase = new GetVehicleUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the vehicle that match the id", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await getVehicleUseCase.execute({
      id: seededVehicle.id,
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should successfully return the vehicle that match the license plate", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await getVehicleUseCase.execute({
      licensePlate: seededVehicle.licensePlate,
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should successfully return the vehicle that match the sticker number", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await getVehicleUseCase.execute({
      stickerNumber: seededVehicle.stickerNumber,
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should successfully return the vehicle that match the owner id", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        ownerId: seededUser.id
      }),
      seedVehicle({
        ownerId: seededUser.id
      }),
      seedVehicle({})
    ]);

    const result = await getVehicleUseCase.execute({
      ownerId: seededUser.id,
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });

  it("should successfully return vehicles that matches license plate with the given search key", async () => {
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        stickerNumber: "20201234",
        licensePlate: "ABC1234"
      }),
      seedVehicle({
        stickerNumber: "20201235",
        licensePlate: "145ABC"
      }),
      seedVehicle({})
    ]);

    const result = await getVehicleUseCase.execute({
      searchKey: "ABC",
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });

  it("should successfully return vehicles that matches sticker number with the given search key", async () => {
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        stickerNumber: "20201234"
      }),
      seedVehicle({
        stickerNumber: "20201235"
      }),
      seedVehicle({})
    ]);

    const result = await getVehicleUseCase.execute({
      searchKey: "0123",
      count: "5",
      page: "1"
    });

    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });
});
