import { VehicleStickerNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleStickerNumber";

describe("VehicleStickerNumber", () => {
  it("should match valid sticker number", () => {
    const validStickerNumber = "12345678";
    const vehicleOrFailure = VehicleStickerNumber.create(validStickerNumber);

    expect(vehicleOrFailure.isSuccess).toBe(true);
    expect(vehicleOrFailure.getValue()).toBeInstanceOf(VehicleStickerNumber);
    expect(vehicleOrFailure.getValue().value).toBe(validStickerNumber);
  });

  it("should not match invalid sticker number", () => {
    const invalidStickerNumber = "      ";
    const vehicleOrFailure = VehicleStickerNumber.create(invalidStickerNumber);

    expect(vehicleOrFailure.isSuccess).toBe(false);
    expect(vehicleOrFailure.getErrorMessage()).toContain("is not a valid sticker number");
  });
});
