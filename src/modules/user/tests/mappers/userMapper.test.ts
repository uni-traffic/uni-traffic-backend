import { User } from "../../src/domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../../src/domain/models/user/mapper";
import { createUserDomainObject } from "../utils/user/createUserDomainObject";
import { faker } from "@faker-js/faker";

describe("UserMapper", () => {
	let userMapper: IUserMapper;

	beforeAll(() => {
		userMapper = new UserMapper()
	})

	const userSchemaObject = {
		id: faker.string.uuid(),
		username: "Teejeks",
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

	it("should map to domain from persistence data", async () => {
		const userDomainObject = userMapper.toDomain(userSchemaObject);

		expect(userDomainObject).toBeInstanceOf(User);
		expect(userDomainObject.id).toBe(userSchemaObject.id);
		expect(userDomainObject.usernameValue).toBe(userSchemaObject.username);
		expect(userDomainObject.firstName).toBe(userSchemaObject.firstName);
		expect(userDomainObject.lastName).toBe(userSchemaObject.lastName);
		expect(userDomainObject.emailValue).toBe(userSchemaObject.email);
		expect(userDomainObject.role).toBe(userSchemaObject.role);
		expect(userDomainObject.isSuperAdmin).toBe(userSchemaObject.isSuperAdmin);
		expect(userDomainObject.isDeleted).toBe(userSchemaObject.isDeleted);
	});
	
	it("should map to persistence from domain", () => {
		const userDomainObject = createUserDomainObject({});
		const userSchemaObject = userMapper.toPersistence(userDomainObject);

		expect(userSchemaObject.id).toBe(userDomainObject.id);
		expect(userSchemaObject.username).toBe(userDomainObject.usernameValue);
		expect(userDomainObject.firstName).toBe(userSchemaObject.firstName);
		expect(userDomainObject.lastName).toBe(userSchemaObject.lastName);
		expect(userSchemaObject.email).toBe(userDomainObject.emailValue);
		expect(userSchemaObject.role).toBe(userDomainObject.role);
		expect(userSchemaObject.isSuperAdmin).toBe(userDomainObject.isSuperAdmin);
		expect(userSchemaObject.isDeleted).toBe(userDomainObject.isDeleted);
	});

	it("should map to DTO from domain", () => {
		const userDomainObject = createUserDomainObject({});
		const userDTO = userMapper.toDTO(userDomainObject);

		expect(userDTO.id).toBe(userDomainObject.id);
		expect(userDTO.username).toBe(userDomainObject.usernameValue);
		expect(userDTO.email).toBe(userDomainObject.emailValue);
		expect(userDTO.firstName).toBe(userDomainObject.firstName);
		expect(userDTO.lastName).toBe(userDomainObject.lastName);
	});
});
