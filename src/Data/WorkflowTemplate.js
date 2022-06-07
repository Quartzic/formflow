let WorkflowTemplate = {
  name: "Pick",
  submissionFields: [
    {
      id: "sku1",
      label: "SKU 1",
      type: "text",
      initialValue: "",
      placeholder: "64543543",
    },
    {
      id: "sku2",
      label: "SKU 2",
      type: "text",
      initialValue: "",
      placeholder: "64543543",
    },
    {
      id: "matches",
      label: "Matches",
      type: "text",
      initialValue: "",
      placeholder: "64543543",
      magic: {
        type: "match",
        args: ["sku1", "sku2"],
      },
    },
  ],
};
export default WorkflowTemplate;
