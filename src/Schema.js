export let schema = [
  {
    // Product
    name: "Distribution",
    members: [
      {
        // Workflow
        name: "Inbound",
        // Definition for this workflow's form fields
        schema: [
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
            placeholder: "1",
          },
          {
            id: "position",
            label: "Position",
            type: "text",
            initialValue: "",
            placeholder: "33A1B3",
          },
        ],
      },
      {
        // Workflow
        name: "Pick",
        // Definition for this workflow's form fields
        schema: [
          {
            id: "position",
            label: "Position",
            type: "text",
            initialValue: "",
            placeholder: "33A1B3",
          },
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
            placeholder: "1",
          },
        ],
      },
      {
        // Workflow
        name: "Put Away",
        // Definition for this workflow's form fields
        schema: [
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
            placeholder: "1",
          },
          {
            id: "position",
            label: "Position",
            type: "text",
            initialValue: "",
            placeholder: "33A1B3",
          },
        ],
      },
      {
        // Workflow
        name: "Validation",
        // Definition for this workflow's form fields
        schema: [
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
            type: "number",
            initialValue: "",
            placeholder: "64543543",
          },
          {
            id: "match",
            label: "Matches?",
            type: "derived",
            sources: ["sku1", "sku2"],
            formula: (sku1, sku2) => sku1 === sku2,
            placeholder: "33A1B3",
          },
        ],
      },
    ],
  },
];
