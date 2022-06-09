import { createWorkflowSelectorOptions } from "./SetupFormTemplate";

it("createSetupFormFields", () => {
  // createSetupFormFields takes in a list of workflows and returns a form template containing a workflow selector.
  // The workflow selector should have one option for each workflow that was passed in, in the same order.
  expect(
    createWorkflowSelectorOptions([
      {
        name: "Inbound",
        id: "inbound",
      },
      {
        name: "Outbound",
        id: "outbound",
      },
    ])
  ).toEqual([
    { label: "Inbound", value: "inbound" },
    { label: "Outbound", value: "outbound" },
  ]);

  // An empty list of workflows should throw an error.
  expect(() => {
    createWorkflowSelectorOptions([]);
  }).toThrowError();
});
