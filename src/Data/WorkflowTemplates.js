let WorkflowTemplates = [
  {
    name: "Inbound",
    id: "inbound",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "64543543",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "1A3B5C",
      },
    ],
  },
  {
    name: "Outbound",
    id: "outbound",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "64543543",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "1A3B5C",
      },
    ],
  },
  {
    name: "Put Away",
    id: "putaway",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "64543543",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "1A3B5C",
      },
    ],
  },
  {
    name: "Pick",
    id: "pick",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "64543543",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "1A3B5C",
      },
    ],
  },
  {
    name: "Validation",
    id: "validation",
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
        magic: {
          type: "match",
          args: ["sku1", "sku2"],
        },
      },
    ],
  },
  {
    name: "Validation with Levenshtein",
    id: "validation-lv",
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
        magic: {
          type: "fuzzyMatch",
          args: ["sku1", "sku2"],
        },
      },
    ],
  },
];

export default WorkflowTemplates;
