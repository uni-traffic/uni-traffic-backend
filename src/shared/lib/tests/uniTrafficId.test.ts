import { uniTrafficId } from "../uniTrafficId";

describe("UniTrafficId", () => {
  it("should uniquely create 1 million unique id", () => {
    const idSet = new Set<string>();
    const total = 1_000_000;

    for (let i = 0; i < total; i++) {
      const newId = uniTrafficId("S");

      if (idSet.has(newId)) {
        throw new Error(`Duplicate ID found: ${newId}`);
      }

      idSet.add(newId);
    }

    expect(idSet.size).toBe(total);
  });
});
