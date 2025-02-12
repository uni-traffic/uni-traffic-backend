import { User } from "../../../../src/domain/models/user/classes/user";
import { type IUserFactory, UserFactory } from "../../../../src/domain/models/user/factory";
import { faker } from "@faker-js/faker";

describe("UserFactory", () => {
    let mockUserData: IUserFactory;

    beforeEach(() => {
        mockUserData = {
            id: faker.string.uuid(),
            username: faker.word.sample({ length: 15 }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
            isSuperAdmin: false,
            isDeleted: false,
            deletedAt: null,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
        };
    });

    it("should successfully create a User when all properties are valid", () => {
        const result = UserFactory.create(mockUserData);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(User);

        const user = result.getValue();
        expect(user.id).toBe(mockUserData.id);
        expect(user.usernameValue).toBe(mockUserData.username);
        expect(user.firstName).toBe(mockUserData.firstName);
        expect(user.lastName).toBe(mockUserData.lastName);
        expect(user.emailValue).toBe(mockUserData.email);
        expect(user.password).toBe(mockUserData.password);
        expect(user.role).toBe(mockUserData.role);
        expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
        expect(user.createdAt).toBe(mockUserData.createdAt);
        expect(user.updatedAt).toBe(mockUserData.updatedAt);
    });

    it("should fail to create a User when email format is invalid", () => {
        mockUserData.email = faker.string.alpha({ length: 10 });

        const result = UserFactory.create(mockUserData);

        expect(result.isFailure).toBe(true);
        expect(result.getErrorMessage()).toBe(`${mockUserData.email} is not a valid email address`);
    });

    it("should fail to create a User when username exceeds the character limit", () => {
        mockUserData.username = "a".repeat(16);

        const result = UserFactory.create(mockUserData);

        expect(result.isFailure).toBe(true);
        expect(result.getErrorMessage()).toBe(
            "Username is limited to 15 characters long"
        );
    });
});