import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../src/repositories/vehicleRepository";
import { seedVehicle } from "../../utils/vehicle/seedVehicle";

describe("VehicleRepository.getVehicles", () => {
  let vehicleRepository: IVehicleRepository;

  beforeAll(async () => {
    vehicleRepository = new VehicleRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should retrieve an existing vehicle by ID", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await vehicleRepository.getVehicles({
      id: seededVehicle.id,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: {
            _value: seededVehicle.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle.licensePlate
          }
        })
      ])
    );
  });

  it("should successfully return the vehicle that match the license plate", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await vehicleRepository.getVehicles({
      licensePlate: seededVehicle.licensePlate,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: {
            _value: seededVehicle.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle.licensePlate
          }
        })
      ])
    );
  });

  it("should successfully return the vehicle that match the sticker number", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const result = await vehicleRepository.getVehicles({
      stickerNumber: seededVehicle.stickerNumber,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: {
            _value: seededVehicle.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle.licensePlate
          }
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

    const result = await vehicleRepository.getVehicles({
      ownerId: seededUser.id,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: {
            _value: seededVehicle1.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle1.licensePlate
          }
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: {
            _value: seededVehicle2.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle2.licensePlate
          }
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

    const result = await vehicleRepository.getVehicles({
      searchKey: "ABC",
      count: 5,
      page: 1
    });

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: {
            _value: seededVehicle1.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle1.licensePlate
          }
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: {
            _value: seededVehicle2.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle2.licensePlate
          }
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

    const result = await vehicleRepository.getVehicles({
      searchKey: "0123",
      count: 5,
      page: 1
    });

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: {
            _value: seededVehicle1.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle1.licensePlate
          }
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: {
            _value: seededVehicle2.stickerNumber
          },
          licensePlate: {
            _value: seededVehicle2.licensePlate
          }
        })
      ])
    );
  });
});
