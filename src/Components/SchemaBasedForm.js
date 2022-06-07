import { Field, Form, Formik } from "formik";
import React, { useRef } from "react";
import classNames from "classnames";

function SchemaBasedForm(props) {
  let initialValues = {};
  const firstFormFieldRef = useRef(null);
  props.fields.forEach((field) => {
    initialValues[field.id] = field.initialValue;
  });
  let normalFields = props.fields.filter((field) => !field.magic);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};
        // For each field in the schema, we need to check if it's in an error state.
        props.fields.forEach((field) => {
          // The field only requires user input if it's not optional or magic.
          let fieldRequiresUserInput = !(field.optional || field.magic);
          // If the field requires a user-input value, but one isn't set, there's an error.
          if (fieldRequiresUserInput && !values[field.id]) {
            errors[field.id] = `${field.label} is required`;
          }
        });

        // TODO: Add more validation here.
        return errors;
      }}
      onSubmit={async (values, { resetForm }) => {
        // Return the results to the workflow session
        props.submissionCallback({
          ...values,
          timestamp: new Date(),
        });

        // Focus on first form field
        if (firstFormFieldRef.current) {
          firstFormFieldRef.current.focus();
        }

        // Clear values and touched state
        resetForm();
      }}
    >
      {({ errors, touched, values, submitForm }) => (
        <Form className="space-y-4">
          {
            // create each form field
            props.fields.map((field, index) => {
              // Check if there are errors for this field—if so, highlight the field in red.
              let formFieldClass =
                "rounded-lg border border-gray-200 border-2 block py-1 px-3 w-full";
              if (errors[field.id] && touched[field.id]) {
                formFieldClass = classNames(
                  formFieldClass,
                  "border-red-500 border-2"
                );
              }

              // Check if this form field is magic; if so, calculate its value.
              if (field.magic) {
                let magicValue = null;
                switch (field.magic.type) {
                  case "match":
                    // Match expects two arguments and checks if they are equal.
                    magicValue =
                      values[field.magic.args[0]] ===
                      values[field.magic.args[1]];
                    // We also will highlight the form field in red or green.
                    formFieldClass = classNames(
                      formFieldClass,
                      magicValue ? "bg-green-100" : "bg-red-100"
                    );
                    break;
                  default:
                    throw new Error(`Unknown magic type: ${field.magic.type}`);
                }
                values[field.id] = magicValue;
              }

              return (
                <div key={index}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-bold text-gray-700"
                  >
                    {field.label}
                    {field.label === "Quantity" && `(in ${props.qtyUnits})`}
                  </label>
                  <Field
                    id={field.id}
                    as={field.type === "select" ? "select" : "input"}
                    // Autofocus on the first field that can accept input
                    autoFocus={normalFields.indexOf(field) === 0}
                    innerRef={
                      normalFields.indexOf(field) === 0
                        ? firstFormFieldRef
                        : null
                    }
                    // If this field is the last field that can accept input, submit the form when the user presses tab.
                    onKeyDown={
                      normalFields.indexOf(field) === normalFields.length - 1
                        ? (e) => {
                            if (e.key === "Tab") {
                              e.preventDefault();
                              submitForm();
                            }
                          }
                        : null
                    }
                    name={field.id}
                    placeholder={field.placeholder}
                    disabled={field.magic}
                    className={formFieldClass}
                  >
                    {field.type === "select"
                      ? field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      : null}
                  </Field>
                </div>
              );
            })
          }

          <button
            type="submit"
            className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default SchemaBasedForm;
