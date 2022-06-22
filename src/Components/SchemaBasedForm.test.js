import {evaluateMagicField} from "./SchemaBasedForm";

describe("Evaluate magic fields", () => {
  describe("Match", () => {
    // The magic type "match" expects two arguments and checks if they are equal.
    const field = {
      id: "testField",
      magic: {
        type: "match",
        args: ["field1", "field2"],
      },
    };
    it("should return true when values match", () => {
      let values = {
        field1: "apple",
        field2: "apple",
      };

      // The first argument is equal to the second argument, so the expected result is true.
      expect(evaluateMagicField(field, values)).toBe(true);
    });
    it("should return false when values don't match", () => {
      let values = {
        field1: "apple",
        field2: "banana",
      };

      // The first argument is not equal to the second argument, so the expected result is false.
      expect(evaluateMagicField(field, values)).toBe(false);
    });
    it("should throw an error when values are undefined", () => {
      let values = {};

      // If either argument that the magic field expects is not set, the magic field throws an error.
      expect(() => {
        evaluateMagicField(field, values);
      }).toThrowError();
    });
  });
});