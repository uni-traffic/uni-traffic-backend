import { faker } from "@faker-js/faker";
import { VehicleApplicationDriver } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationDriver";

describe("VehicleApplicationDriver", () => {
  it("should create a valid driver", () => {
    const validProps = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      licenseId: faker.string.uuid(),
      licenseImage: faker.image.url(),
      selfiePicture: faker.image.url()
    };

    const driverOrFailure = VehicleApplicationDriver.create(validProps);

    expect(driverOrFailure.isSuccess).toBe(true);
    expect(driverOrFailure.getValue()).toBeInstanceOf(VehicleApplicationDriver);
    expect(driverOrFailure.getValue().firstName).toBe(validProps.firstName);
    expect(driverOrFailure.getValue().lastName).toBe(validProps.lastName);
    expect(driverOrFailure.getValue().licenseId).toBe(validProps.licenseId);
    expect(driverOrFailure.getValue().licenseImage).toBe(validProps.licenseImage);
  });

  it("should return failure if no driver information is provided", () => {
    const invalidProps = {
      firstName: "",
      lastName: "",
      licenseId: "",
      licenseImage: "",
      selfiePicture: ""
    };

    const driverOrFailure = VehicleApplicationDriver.create(invalidProps);

    expect(driverOrFailure.isSuccess).toBe(true);
    expect(driverOrFailure.getValue()).toBeInstanceOf(VehicleApplicationDriver);
    expect(driverOrFailure.getValue().firstName).toBe("");
    expect(driverOrFailure.getValue().lastName).toBe("");
    expect(driverOrFailure.getValue().licenseId).toBe("");
    expect(driverOrFailure.getValue().licenseImage).toBe("");
  });
});
