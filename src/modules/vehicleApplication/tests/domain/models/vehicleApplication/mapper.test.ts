import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../../../../src/domain/models/vehicleApplication/mapper";
import { createVehicleApplicationDomainObject } from "../../../utils/createVehicleApplicationDomainObject";
import { createVehicleApplicationPersistenceData } from "../../../utils/createVehiclePersistenceData";

describe("VehicleApplicationMapper", () => {
  let vehicleApplicationMapper: IVehicleApplicationMapper;

  beforeAll(() => {
    vehicleApplicationMapper = new VehicleApplicationMapper();
  });

  it("should successfully map persistence data to domain", () => {
    const persistenceData = createVehicleApplicationPersistenceData({});
    const vehicleApplicationDomain = vehicleApplicationMapper.toDomain(persistenceData);

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

  it("should successfully map domain to persistence", () => {
    const vehicleApplicationDomain = createVehicleApplicationDomainObject({});
    const persistenceData = vehicleApplicationMapper.toPersistence(vehicleApplicationDomain);

    expect(persistenceData.id).toBe(vehicleApplicationDomain.id);
    expect(persistenceData.stickerNumber).toBe(vehicleApplicationDomain.stickerNumber);
    expect(persistenceData.remarks).toBe(vehicleApplicationDomain.remarks);
    expect(persistenceData.createdAt!.toString()).toBe(
      vehicleApplicationDomain.createdAt.toString()
    );
    expect(persistenceData.updatedAt!.toString()).toBe(
      vehicleApplicationDomain.updatedAt.toString()
    );
    expect(persistenceData.driverLastName).toBe(vehicleApplicationDomain.driver.lastName);
    expect(persistenceData.driverFirstName).toBe(vehicleApplicationDomain.driver.firstName);
    expect(persistenceData.driverLicenseId).toBe(vehicleApplicationDomain.driver.licenseId);
    expect(persistenceData.driverLicenseImage).toBe(vehicleApplicationDomain.driver.licenseImage);
    expect(persistenceData.lastName).toBe(vehicleApplicationDomain.schoolMember.lastName);
    expect(persistenceData.firstName).toBe(vehicleApplicationDomain.schoolMember.firstName);
    expect(persistenceData.schoolId).toBe(vehicleApplicationDomain.schoolMember.schoolId);
    expect(persistenceData.userType).toBe(vehicleApplicationDomain.schoolMember.type);
    expect(persistenceData.schoolCredential).toBe(
      vehicleApplicationDomain.schoolMember.schoolCredential
    );
    expect(persistenceData.type).toBe(vehicleApplicationDomain.vehicle.type);
    expect(persistenceData.model).toBe(vehicleApplicationDomain.vehicle.model);
    expect(persistenceData.sideImage).toBe(vehicleApplicationDomain.vehicle.sideImage);
    expect(persistenceData.series).toBe(vehicleApplicationDomain.vehicle.series);
    expect(persistenceData.make).toBe(vehicleApplicationDomain.vehicle.make);
    expect(persistenceData.officialReceipt).toBe(vehicleApplicationDomain.vehicle.officialReceipt);
    expect(persistenceData.certificateOfRegistration).toBe(
      vehicleApplicationDomain.vehicle.certificateOfRegistration
    );
    expect(persistenceData.backImage).toBe(vehicleApplicationDomain.vehicle.backImage);
    expect(persistenceData.frontImage).toBe(vehicleApplicationDomain.vehicle.frontImage);
    expect(persistenceData.licensePlate).toBe(vehicleApplicationDomain.vehicle.licensePlate);
    expect(persistenceData.status).toBe(vehicleApplicationDomain.status.value);
    expect(persistenceData.payment).toBe(vehicleApplicationDomain.payment);
  });

  it("should map domain to dto", () => {
    const vehicleApplicationDomain = createVehicleApplicationDomainObject({});
    const vehicleApplicationDTO = vehicleApplicationMapper.toDTO(vehicleApplicationDomain);

    expect(vehicleApplicationDTO.id).toBe(vehicleApplicationDomain.id);
    expect(vehicleApplicationDTO.stickerNumber).toBe(vehicleApplicationDomain.stickerNumber);
    expect(vehicleApplicationDTO.remarks).toBe(vehicleApplicationDomain.remarks);
    expect(vehicleApplicationDTO.createdAt!.toString()).toBe(
      vehicleApplicationDomain.createdAt.toString()
    );
    expect(vehicleApplicationDTO.updatedAt!.toString()).toBe(
      vehicleApplicationDomain.updatedAt.toString()
    );
    expect(vehicleApplicationDTO.driver.lastName).toBe(vehicleApplicationDomain.driver.lastName);
    expect(vehicleApplicationDTO.driver.firstName).toBe(vehicleApplicationDomain.driver.firstName);
    expect(vehicleApplicationDTO.driver.licenseId).toBe(vehicleApplicationDomain.driver.licenseId);
    expect(vehicleApplicationDTO.driver.licenseImage).toBe(
      vehicleApplicationDomain.driver.licenseImage
    );
    expect(vehicleApplicationDTO.schoolMember.lastName).toBe(
      vehicleApplicationDomain.schoolMember.lastName
    );
    expect(vehicleApplicationDTO.schoolMember.firstName).toBe(
      vehicleApplicationDomain.schoolMember.firstName
    );
    expect(vehicleApplicationDTO.schoolMember.schoolId).toBe(
      vehicleApplicationDomain.schoolMember.schoolId
    );
    expect(vehicleApplicationDTO.schoolMember.type).toBe(
      vehicleApplicationDomain.schoolMember.type
    );
    expect(vehicleApplicationDTO.schoolMember.schoolCredential).toBe(
      vehicleApplicationDomain.schoolMember.schoolCredential
    );
    expect(vehicleApplicationDTO.vehicle.type).toBe(vehicleApplicationDomain.vehicle.type);
    expect(vehicleApplicationDTO.vehicle.model).toBe(vehicleApplicationDomain.vehicle.model);
    expect(vehicleApplicationDTO.vehicle.sideImage).toBe(
      vehicleApplicationDomain.vehicle.sideImage
    );
    expect(vehicleApplicationDTO.vehicle.series).toBe(vehicleApplicationDomain.vehicle.series);
    expect(vehicleApplicationDTO.vehicle.make).toBe(vehicleApplicationDomain.vehicle.make);
    expect(vehicleApplicationDTO.vehicle.officialReceipt).toBe(
      vehicleApplicationDomain.vehicle.officialReceipt
    );
    expect(vehicleApplicationDTO.vehicle.certificateOfRegistration).toBe(
      vehicleApplicationDomain.vehicle.certificateOfRegistration
    );
    expect(vehicleApplicationDTO.vehicle.backImage).toBe(
      vehicleApplicationDomain.vehicle.backImage
    );
    expect(vehicleApplicationDTO.vehicle.frontImage).toBe(
      vehicleApplicationDomain.vehicle.frontImage
    );
    expect(vehicleApplicationDTO.vehicle.licensePlate).toBe(
      vehicleApplicationDomain.vehicle.licensePlate
    );
    expect(vehicleApplicationDTO.status).toBe(vehicleApplicationDomain.status.value);
    expect(vehicleApplicationDTO.applicant).toBe(vehicleApplicationDomain.applicant);
    expect(vehicleApplicationDTO.payment).toBe(vehicleApplicationDomain.payment);
  });
});
