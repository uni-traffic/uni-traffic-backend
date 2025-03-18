import { VehicleApplicationFactory } from "../../../../src/domain/models/vehicleApplication/factory";
import { createVehicleApplicationPersistenceData } from "../../../utils/createVehiclePersistenceData";

describe("VehicleApplicationFactory", () => {
  it("should successfully create VehicleApplication from persistence data", () => {
    const persistenceData = createVehicleApplicationPersistenceData({});

    const vehicleApplicationDomainOrError = VehicleApplicationFactory.create(persistenceData);

    expect(vehicleApplicationDomainOrError.isSuccess).toBe(true);
    const vehicleApplicationDomain = vehicleApplicationDomainOrError.getValue();

    expect(vehicleApplicationDomain.id).toBe(persistenceData.id);
    expect(vehicleApplicationDomain.stickerNumber).toBe(persistenceData.stickerNumber);
    expect(vehicleApplicationDomain.remarks).toBe(persistenceData.remarks);
    expect(vehicleApplicationDomain.createdAt.toString()).toBe(
      persistenceData.createdAt.toString()
    );
    expect(vehicleApplicationDomain.updatedAt.toString()).toBe(
      persistenceData.updatedAt.toString()
    );
    expect(vehicleApplicationDomain.driver.lastName).toBe(persistenceData.driverLastName);
    expect(vehicleApplicationDomain.driver.firstName).toBe(persistenceData.driverFirstName);
    expect(vehicleApplicationDomain.driver.licenseId).toBe(persistenceData.driverLicenseId);
    expect(vehicleApplicationDomain.driver.licenseImage).toBe(persistenceData.driverLicenseImage);
    expect(vehicleApplicationDomain.schoolMember.lastName).toBe(persistenceData.lastName);
    expect(vehicleApplicationDomain.schoolMember.firstName).toBe(persistenceData.firstName);
    expect(vehicleApplicationDomain.schoolMember.schoolId).toBe(persistenceData.schoolId);
    expect(vehicleApplicationDomain.schoolMember.type).toBe(persistenceData.userType);
    expect(vehicleApplicationDomain.schoolMember.schoolCredential).toBe(
      persistenceData.schoolCredential
    );
    expect(vehicleApplicationDomain.vehicle.type).toBe(persistenceData.type);
    expect(vehicleApplicationDomain.vehicle.model).toBe(persistenceData.model);
    expect(vehicleApplicationDomain.vehicle.sideImage).toBe(persistenceData.sideImage);
    expect(vehicleApplicationDomain.vehicle.series).toBe(persistenceData.series);
    expect(vehicleApplicationDomain.vehicle.make).toBe(persistenceData.make);
    expect(vehicleApplicationDomain.vehicle.officialReceipt).toBe(persistenceData.officialReceipt);
    expect(vehicleApplicationDomain.vehicle.certificateOfRegistration).toBe(
      persistenceData.certificateOfRegistration
    );
    expect(vehicleApplicationDomain.vehicle.backImage).toBe(persistenceData.backImage);
    expect(vehicleApplicationDomain.vehicle.frontImage).toBe(persistenceData.frontImage);
    expect(vehicleApplicationDomain.vehicle.licensePlate).toBe(persistenceData.licensePlate);
    expect(vehicleApplicationDomain.status.value).toBe(persistenceData.status);
  });
});
