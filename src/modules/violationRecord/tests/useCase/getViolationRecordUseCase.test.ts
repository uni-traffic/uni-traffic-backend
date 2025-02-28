import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import { GetViolationRecordInformationUseCase } from "../../src/useCases/getViolationRecordUseCase";
import { createVehiclePersistenceData } from "../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { createViolationPersistenceData } from "../../../violation/tests/utils/violation/createViolationPersistenceData";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { ViolationRecordRequest } from "../../src/dtos/violationRecordRequestSchema";
import type { IViolationRecordDTO } from "../../src/dtos/violationRecordDTO";

const assertViolationRecord = (received: IViolationRecordDTO, expected: IViolationRecordDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.reportedById).toBe(expected.reportedById);
  expect(received.reporter?.id).toBe(expected.reporter?.id);
  expect(received.status).toBe(expected.status);
  expect(received.user?.id).toBe(expected.user?.id);
  expect(received.userId).toBe(expected.userId);
  expect(received.vehicle?.id).toBe(expected.vehicle?.id);
  expect(received.vehicleId).toBe(expected.vehicleId);
  expect(received.violation?.id).toBe(expected.violation?.id);
  expect(received.violationId).toBe(expected.violationId);
};

describe("GetViolationRecordUseCase", () => {
  let getViolationRecordUseCase: GetViolationRecordInformationUseCase;
  let seededViolation: IViolationRecordDTO;

  beforeAll(async () => {
    getViolationRecordUseCase = new GetViolationRecordInformationUseCase();

    const user = await db.user.create({
      data: createUserPersistenceData({})
    });

    const reporter = await db.user.create({
      data: createUserPersistenceData({})
    });

    const violation = await db.violation.create({
      data: createViolationPersistenceData({})
    });
    const vehicleData = createVehiclePersistenceData({});
    const { owner, ...vehicleDataWithoutOwner } = vehicleData;

    await db.vehicle.create({
      data: {
        ...vehicleDataWithoutOwner,
        ownerId: user.id
      },
      include: {
        owner: true
      }
    });

    seededViolation = await db.violationRecord.create({
      data: {
        id: uuid(),
        violationId: violation.id,
        vehicleId: vehicleData.id,
        userId: user.id,
        reportedById: reporter.id,
        status: faker.helpers.arrayElement(["UNPAID", "PAID"])
      },
      include: {
        reporter: true,
        user: true,
        vehicle: {
          include: {
            owner: true
          }
        },
        violation: true
      }
    });
  });

  it("should return ViolationRecordDTO when id is provided", async () => {
    const mockRequest: ViolationRecordRequest = {
      id: seededViolation.id
    };

    const violationRecordDTO = await getViolationRecordUseCase.execute(mockRequest);

    expect(violationRecordDTO).toBeDefined();
    assertViolationRecord(violationRecordDTO, seededViolation);
  });
});
