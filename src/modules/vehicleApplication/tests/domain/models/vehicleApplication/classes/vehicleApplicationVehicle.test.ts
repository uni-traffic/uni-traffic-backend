import { VehicleApplicationVehicle } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationVehicle";

describe("VehicleApplicationVehicle", () => {
  it("should create a valid 'CAR' vehicle application", () => {
    const validProps = {
      make: "Toyota",
      series: "Corolla",
      type: "CAR",
      model: "2022",
      licensePlate: "XYZ123",
      certificateOfRegistration: "CERT123",
      officialReceipt: "REC123",
      frontImage: "front.jpg",
      sideImage: "side.jpg",
      backImage: "back.jpg"
    };

    const vehicleOrFailure = VehicleApplicationVehicle.create(validProps);

    expect(vehicleOrFailure.isSuccess).toBe(true);
    expect(vehicleOrFailure.getValue()).toBeInstanceOf(VehicleApplicationVehicle);
    expect(vehicleOrFailure.getValue().make).toBe(validProps.make);
    expect(vehicleOrFailure.getValue().type).toBe(validProps.type);
    expect(vehicleOrFailure.getValue().licensePlate).toBe(validProps.licensePlate);
  });

  it("should create a valid 'MOTORCYCLE' vehicle application", () => {
    const validProps = {
      make: "Honda",
      series: "CBR500",
      type: "MOTORCYCLE",
      model: "2021",
      licensePlate: "ABC123",
      certificateOfRegistration: "CERT456",
      officialReceipt: "REC456",
      frontImage: "front_motorcycle.jpg",
      sideImage: "side_motorcycle.jpg",
      backImage: "back_motorcycle.jpg"
    };

    const vehicleOrFailure = VehicleApplicationVehicle.create(validProps);

    expect(vehicleOrFailure.isSuccess).toBe(true);
    expect(vehicleOrFailure.getValue()).toBeInstanceOf(VehicleApplicationVehicle);
    expect(vehicleOrFailure.getValue().make).toBe(validProps.make);
    expect(vehicleOrFailure.getValue().type).toBe(validProps.type);
    expect(vehicleOrFailure.getValue().licensePlate).toBe(validProps.licensePlate);
  });

  it("should not create a vehicle with an invalid type", () => {
    const invalidProps = {
      make: "Ford",
      series: "Focus",
      type: "BICYCLE", // Invalid type
      model: "2022",
      licensePlate: "XYZ456",
      certificateOfRegistration: "CERT789",
      officialReceipt: "REC789",
      frontImage: "front_invalid.jpg",
      sideImage: "side_invalid.jpg",
      backImage: "back_invalid.jpg"
    };

    const vehicleOrFailure = VehicleApplicationVehicle.create(invalidProps);

    expect(vehicleOrFailure.isSuccess).toBe(false);
    expect(vehicleOrFailure.getErrorMessage()).toContain(
      "Invalid Vehicle type. Valid types are CAR, MOTORCYCLE"
    );
  });

  it("should not create a vehicle with an empty type", () => {
    const invalidProps = {
      make: "Chevrolet",
      series: "Camaro",
      type: "", // Empty type
      model: "2023",
      licensePlate: "XYZ789",
      certificateOfRegistration: "CERT000",
      officialReceipt: "REC000",
      frontImage: "front_empty_type.jpg",
      sideImage: "side_empty_type.jpg",
      backImage: "back_empty_type.jpg"
    };

    const vehicleOrFailure = VehicleApplicationVehicle.create(invalidProps);

    expect(vehicleOrFailure.isSuccess).toBe(false);
    expect(vehicleOrFailure.getErrorMessage()).toContain(
      "Invalid Vehicle type. Valid types are CAR, MOTORCYCLE"
    );
  });

  it("should not create a vehicle with a mixed case type", () => {
    const invalidProps = {
      make: "Nissan",
      series: "Altima",
      type: "car", // Mixed case type
      model: "2021",
      licensePlate: "XYZ101",
      certificateOfRegistration: "CERT999",
      officialReceipt: "REC999",
      frontImage: "front_mixed_case.jpg",
      sideImage: "side_mixed_case.jpg",
      backImage: "back_mixed_case.jpg"
    };

    const vehicleOrFailure = VehicleApplicationVehicle.create(invalidProps);

    expect(vehicleOrFailure.isSuccess).toBe(false);
    expect(vehicleOrFailure.getErrorMessage()).toContain(
      "Invalid Vehicle type. Valid types are CAR, MOTORCYCLE"
    );
  });
});
