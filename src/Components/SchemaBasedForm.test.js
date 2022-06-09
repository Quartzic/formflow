import { evaluateMagicField } from "./SchemaBasedForm";

it("evaluateMagicFieldMatch", () => {
  // The magic type "match" expects two arguments and checks if they are equal.
  const field = {
    id: "testField",
    magic: {
      type: "match",
      args: ["field1", "field2"],
    },
  };

  let values = {
    field1: "apple",
    field2: "apple",
  };

  // The first argument is equal to the second argument, so the expected result is true.
  expect(evaluateMagicField(field, values)).toBe(true);

  values = {
    field1: "apple",
    field2: "banana",
  };

  // The first argument is not equal to the second argument, so the expected result is false.
  expect(evaluateMagicField(field, values)).toBe(false);

  values = {};

  // If either argument that the magic field expects is not set, the magic field is not evaluated.
  expect(() => {
    evaluateMagicField(field, values);
  }).toEqual(null);
});
