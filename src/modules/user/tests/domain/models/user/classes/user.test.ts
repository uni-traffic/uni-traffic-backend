import { User } from "../../../../../src/domain/models/user/classes/user";
import { UserEmail } from "../../../../../src/domain/models/user/classes/userEmail";
import { Role } from "@prisma/client";
import { faker } from "@faker-js/faker";

describe("User", () => {
    const mockUserData: {
        id: string;
        username: string;
        email: UserEmail;
        password: string;
        isSuperAdmin: boolean;
        role: Role;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } = {
        id: faker.string.uuid(),
        username: faker.person.firstName(),
        email: UserEmail.create(faker.internet.email()).getValue(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
        isSuperAdmin: false,
        isDeleted: false,
        deletedAt: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
    };

    it("should create a User", () => {
        const user = User.create(mockUserData);

        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(mockUserData.id);
        expect(user.username).toBe(mockUserData.username);
        expect(user.emailValue).toBe(mockUserData.email.value);
        expect(user.password).toBe(mockUserData.password);
        expect(user.role).toBe(mockUserData.role);
        expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
        expect(user.isDeleted.toString()).toBe(mockUserData.isDeleted.toString());
        expect(user.createdAt.toString()).toBe(mockUserData.createdAt.toString());
        expect(user.updatedAt.toString()).toBe(mockUserData.updatedAt.toString());
    });
});

