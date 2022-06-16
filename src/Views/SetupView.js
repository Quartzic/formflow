import SchemaBasedForm from "../Components/SchemaBasedForm";
import { additionalFields } from "../Data/SetupFormTemplate";
import { debug } from "../Data/SimpleLogger";

export function setupView(fields, workflows, setMetadata, setWorkflow) {
  return (
    <>
      <SchemaBasedForm
        fields={fields}
        submissionCallback={(values) => {
          // First, we find the original workflow template; this is a reference, so we can't update it directly
          let workflowTemplate = workflows.find(
            (workflow) => workflow.id === values.workflow
          );
          // Create a variable to hold the new fields, and copy the old fields into it
          let workflowFields = Object.assign(
            [],
            workflowTemplate.submissionFields
          );

          if (values["additionalFields"]) {
            // Add the additional fields to the workflow; may error if the additional fields have changed since the selection was made
            values["additionalFields"].forEach((field) => {
              workflowFields.push(
                additionalFields.filter(
                  (additionalField) => additionalField.id === field
                )[0]
              );
            });
          } else {
            // If the user didn't select any additional fields (or none were presented), do nothing
          }

          // Update the metadata with the values from the form
          setMetadata(values);
          debug("Set metadata", values);

          // If a quantity-units value exists, add a hint to any matching fields in the workflow
          if (values["qtyUnits"]) {
            workflowFields.forEach((field) => {
              if (field.id === "quantity") {
                field.units = values["qtyUnits"];
              }
            });
          }

          // Set the workflow to a new one based on the template and modified fields
          setWorkflow({
            ...workflowTemplate,
            submissionFields: workflowFields,
          });
          debug("Set workflow", {
            ...workflowTemplate,
            submissionFields: workflowFields,
          });
        }}
      />
    </>
  );
}
