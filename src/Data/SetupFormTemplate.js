export const additionalFields = [
  /*  {
    id: "lpn",
    label: "License Plate Number",
    type: "text",
    initialValue: "",
    placeholder: "",
  },
  {
    id: "lotnumber",
    label: "Lot Number",
    type: "text",
    initialValue: "",
    placeholder: "",
  },
  {
    id: "ponumber",
    label: "PO Number",
    type: "text",
    initialValue: "",
    placeholder: "",
  },*/
];

export function createWorkflowSelectorOptions(workflows) {
  // Create an option for each workflow
  const workflowSelectorOptions = workflows.map((workflow) => ({
    label: workflow.name,
    value: workflow.id,
  }));
  if (workflowSelectorOptions.length === 0) {
    throw new Error("No workflows found");
  }
  return workflowSelectorOptions;
}

export function createSetupFormFields(workflows) {
  const workflowSelectorOptions = createWorkflowSelectorOptions(workflows);
  // Return setup form fields, with the workflow selector derived from the argument workflows.
  return [
    {
      id: "username",
      label: "Username",
      type: "text",
      initialValue: "",
      placeholder: "",
    },
    {
      id: "refNumber",
      label: "Reference Number",
      type: "text",
      initialValue: "",
      placeholder: "",
    },
    /*{
      id: "qtyUnits",
      label: "Quantity units",
      type: "select",
      initialValue: "pcs",
      options: [
        {
          label: "Pieces",
          value: "pcs",
        },
        {
          label: "Units",
          value: "units",
        },
        {
          label: "Pallets",
          value: "pallets",
        },
        {
          label: "Cartons",
          value: "cartons",
        },
      ],
    },*/
    {
      id: "workflow",
      label: "Select a workflow template",
      type: "select",
      initialValue: workflowSelectorOptions[0].value,
      options: workflowSelectorOptions,
    },
    /* additionalFields.length > 0 && {
      id: "additionalFields",
      label: "Add additional fields",
      type: "checkbox-group",
      options: additionalFields.map((field) => {
        return {
          label: field.label,
          value: field.id,
        };
      }),
      initialValue: [],
      optional: true,
    },*/
  ];
}
