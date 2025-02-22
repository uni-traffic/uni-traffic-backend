import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicleDTO } from "../../src/dtos/vehicleDTO";
import type { VehicleRequest } from "../../src/dtos/vehicleRequestSchema";
import { GetVehicleInformationUseCase } from "../../src/useCases/getVehicleInformationUseCase";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

const assertVehicle = (received: IVehicleDTO, expected: IVehicleDTO) => {
  expect(received!.id).toBe(expected.id);
  expect(received!.isActive).toBe(expected.isActive);
  expect(received!.licenseNumber).toBe(expected.licenseNumber);
  expect(received!.stickerNumber).toBe(expected.stickerNumber);
  expect(received!.ownerId).toBe(expected.ownerId);
  expect(received!.owner.id).toBe(expected.owner.id);
  expect(received!.owner.role).toBe(expected.owner.role);
  expect(received!.owner.lastName).toBe(expected.owner.lastName);
  expect(received!.owner.firstName).toBe(expected.owner.firstName);
  expect(received!.owner.email).toBe(expected.owner.email);
  expect(received!.owner.username).toBe(expected.owner.username);
};

describe("GetVehicleInformationUseCase", () => {
  let getVehicleByLicensePlateOrStickerUseCase: GetVehicleInformationUseCase;

  beforeAll(() => {
    getVehicleByLicensePlateOrStickerUseCase = new GetVehicleInformationUseCase();
  });

  it("should return VehicleDTO when id is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      id: seededVehicle.id
    };

    const vehicleDTO = await getVehicleByLicensePlateOrStickerUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should return VehicleDTO when licensePlate is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      licensePlate: seededVehicle.licenseNumber
    };

    const vehicleDTO = await getVehicleByLicensePlateOrStickerUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should return VehicleDTO when stickerNumber is provided", async () => {
    const seededVehicle = await seedVehicle({});
    const mockRequest: VehicleRequest = {
      stickerNumber: seededVehicle.stickerNumber
    };

    const vehicleDTO = await getVehicleByLicensePlateOrStickerUseCase.execute(mockRequest);

    expect(vehicleDTO).toBeDefined();
    assertVehicle(vehicleDTO, seededVehicle);
  });

  it("should throw NotFoundError when provided un-existing id", async () => {
    const mockRequest: VehicleRequest = {
      stickerNumber: "non-existing-id"
    };

    await expect(getVehicleByLicensePlateOrStickerUseCase.execute(mockRequest)).rejects.toThrow(
      new NotFoundError("Vehicle not found.")
    );
  });
});
