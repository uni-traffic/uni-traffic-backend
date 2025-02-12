import type { IUserRawObject } from "../../../../../modules/user/src/domain/models/user/constant";
import { UserFactory } from "../../../../../modules/user/src/domain/models/user/factory";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { IUser } from "../../../src/domain/models/user/classes/user";

export const createUserDomainObject = ({
    id = uuid(),
    username = "arvyx",
    firstName = faker.person.firstName(),
    lastName = faker.person.lastName(),
    email = "tjyumul@gmail.com",
    password = faker.internet.password(),
    role = faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
    isSuperAdmin = false,
    isDeleted = false,
    deletedAt = isDeleted ? new Date() : null,
    createdAt = new Date(),
    updatedAt = new Date(),
}: Partial<IUserRawObject>): IUser => {
    const userOrError = UserFactory.create({
        id,
        username,
        firstName,
        lastName,
        email,
        password,
        isSuperAdmin,
        role,
        isDeleted,
        deletedAt,
        createdAt,
        updatedAt,
    });

    return userOrError.getValue();
};

