let WorkflowTemplates = [
  {
    name: "Exact Validation",
    id: "exact-validation",
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
    name: "Approximate Validation",
    id: "approx-validation",
    submissionFields: [
      {
        id: "sku1",
        label: "SKU 1",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
      {
        id: "sku2",
        label: "SKU 2",
        type: "text",
        initialValue: "",
        placeholder: "",
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
  {
    name: "Inventory / Put Away",
    id: "inventory-putaway",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
      {
        id: "unitspercarton",
        label: "Units per Carton",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "cartons",
        label: "Cartons",
        type: "number",
        initialValue: "1",
        placeholder: "",
      },
      {
        id: "totalunits",
        label: "Total Units",
        type: "number",
        magic: {
            type: "multiply",
            args: ["unitspercarton", "cartons"],
        },
        hidden: true
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
    ],
  },
  {
    name: "SKU & Location",
    id: "sku-loc",
    submissionFields: [
      {
        id: "sku",
        label: "SKU",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
    ],
  },
  {
    name: "LPN & Location",
    id: "lpn-loc",
    submissionFields: [
      {
        id: "lpn",
        label: "License Plate Number",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
    ],
  },
  {
    name: "On Hand & Container",
    id: "onhand-container",
    submissionFields: [
      {
        id: "onhand",
        label: "On Hand",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
      {
        id: "container",
        label: "Container",
        type: "text",
        initialValue: "",
        placeholder: "",
      },
    ],
  },
];

export default WorkflowTemplates;
