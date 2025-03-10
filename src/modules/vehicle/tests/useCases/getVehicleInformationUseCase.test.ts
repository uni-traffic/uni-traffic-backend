import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicleDTO } from "../../src/dtos/vehicleDTO";
import type { VehicleRequest } from "../../src/dtos/vehicleRequestSchema";
import { GetVehicleInformationUseCase } from "../../src/useCases/getVehicleInformationUseCase";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

const assertVehicle = (received: IVehicleDTO, expected: IVehicleDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.status).toBe(expected.status);
  expect(received.licensePlate).toBe(expected.licensePlate);
  expect(received.make).toBe(expected.make);
  expect(received.model).toBe(expected.model);
  expect(received.series).toBe(expected.series);
  expect(received.color).toBe(expected.color);
  expect(received.type).toBe(expected.type);
  expect(received.images).toStrictEqual(expected.images);
  expect(received.stickerNumber).toBe(expected.stickerNumber);
  expect(received.ownerId).toBe(expected.ownerId);
  expect(received.owner).toBeDefined();
};

describe("GetVehicleInformationUseCase", () => {
  let getVehicleInformationUseCase: GetVehicleInformationUseCase;

  beforeAll(() => {
    getVehicleInformationUseCase = new GetVehicleInformationUseCase();
  });

  it("should return VehicleDTO when id is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      id: seededVehicle.id
    };

    const vehicleDTO = await getVehicleInformationUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should return VehicleDTO when licensePlate is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      licensePlate: seededVehicle.licensePlate
    };

    const vehicleDTO = await getVehicleInformationUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should return VehicleDTO when stickerNumber is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      stickerNumber: seededVehicle.stickerNumber
    };

    const vehicleDTO = await getVehicleInformationUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should throw NotFoundError when provided un-existing id", async () => {
    const mockRequest: VehicleRequest = {
      id: "non-existing-id"
    };

    await expect(getVehicleInformationUseCase.execute(mockRequest)).rejects.toThrow(
      new NotFoundError("Vehicle not found.")
    );
  });
});
