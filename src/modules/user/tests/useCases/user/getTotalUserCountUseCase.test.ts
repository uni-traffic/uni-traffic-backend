import { db } from "../../../../../shared/infrastructure/database/prisma";
import { GetTotalUserCountUseCase } from "../../../src/useCases/user/getTotalUserCountUseCase";
import { seedUser } from "../../utils/user/seedUser";
import { IUserRepository, UserRepository } from "../../../src/repositories/userRepository";

describe("GetTotalUserCountUseCase", () => {
    let getTotalUserCountUseCase: GetTotalUserCountUseCase;
    let userRepository: IUserRepository; 
  
    beforeAll(() => {
      userRepository = new UserRepository();
      getTotalUserCountUseCase = new GetTotalUserCountUseCase(userRepository);
    });
  
    beforeEach(async () => {
      await db.user.deleteMany(); 
    });
  
    it("should return the total count of all users", async () => {
      await seedUser({}); 
      const result = await getTotalUserCountUseCase.execute('ALL');
      expect(result.count).toBeGreaterThan(0); 
    });
  
    it("should return the count of MANAGEMENT users", async () => {
      await seedUser({ role: 'CASHIER' });
      await seedUser({ role: 'ADMIN' });
      await seedUser({ role: 'STUDENT' });
      const result = await getTotalUserCountUseCase.execute('MANAGEMENT');
      expect(result.count).toBe(2); 
    });
  
    it("should return the count of APP_USERS", async () => {
      await seedUser({ role: 'STUDENT' });
      await seedUser({ role: 'STAFF' });
      await seedUser({ role: 'GUEST' });
      await seedUser({ role: 'ADMIN' });
      const result = await getTotalUserCountUseCase.execute('APP_USERS');
      expect(result.count).toBe(3);
    });
  
    it("should return 0 if no users match the given type", async () => {
      await seedUser({ role: 'STUDENT' });
      await seedUser({ role: 'STAFF' });
      const result = await getTotalUserCountUseCase.execute('MANAGEMENT');
      expect(result.count).toBe(0); 
    });
  
    it("should return the correct count for roles even when there are no users", async () => {
      const result = await getTotalUserCountUseCase.execute('ALL');
      expect(result.count).toBe(0); 
    });
  
    it("should throw an error if an invalid type is provided", async () => {
      const invalidType = 'INVALID_TYPE';
      await expect(getTotalUserCountUseCase.execute(invalidType)).rejects.toThrow("Invalid user type");
    });
  });
  