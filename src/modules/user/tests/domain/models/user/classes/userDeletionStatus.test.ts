import { UserDeletionStatus } from "../../../../../src/domain/models/user/classes/userDeletionStatus";

describe("UserDeletionStatus", () => {
  describe("create", () => {
    it("should return a successful result when isDeleted is true and deletedAt is provided", () => {
      const deletedAt = new Date();
      const result = UserDeletionStatus.create(true, deletedAt);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().isDeleted).toBe(true);
      expect(result.getValue().deletedAt).toBe(deletedAt);
    });

    it("should return a successful result when isDeleted is false and deletedAt is null", () => {
      const result = UserDeletionStatus.create(false, null);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().isDeleted).toBe(false);
      expect(result.getValue().deletedAt).toBe(null);
    });

    it("should return a failed result when isDeleted is true but deletedAt is not provided", () => {
      const result = UserDeletionStatus.create(true, null);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorMessage()).toBe("Deleted users must have a deletedAt timestamp.");
    });

    it("should return a failed result when isDeleted is false and deletedAt is provided", () => {
      const deletedAt = new Date();
      const result = UserDeletionStatus.create(false, deletedAt);

      expect(result.isSuccess).toBe(false);
    });
  });

  describe("getters", () => {
    it("should return the correct value for isDeleted", () => {
      const deletedAt = new Date();
      const status = UserDeletionStatus.create(true, deletedAt).getValue();

      expect(status.isDeleted).toBe(true);
    });

    it("should return the correct value for deletedAt", () => {
      const deletedAt = new Date("2023-01-01");
      const status = UserDeletionStatus.create(true, deletedAt).getValue();

      expect(status.deletedAt).toBe(deletedAt);
    });

    it("should return null for deletedAt when not deleted", () => {
      const status = UserDeletionStatus.create(false, null).getValue();

      expect(status.deletedAt).toBeNull();
    });
  });

  describe("value", () => {
    it("should return the correct value object", () => {
      const deletedAt = new Date("2023-01-01");
      const status = UserDeletionStatus.create(true, deletedAt).getValue();

      expect(status.value).toEqual({
        isDeleted: true,
        deletedAt: deletedAt
      });
    });

    it("should return the correct value object when not deleted", () => {
      const status = UserDeletionStatus.create(false, null).getValue();

      expect(status.value).toEqual({
        isDeleted: false,
        deletedAt: null
      });
    });
  });
});
