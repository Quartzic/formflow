import {Field, Form, Formik} from "formik";
import React, {useRef} from "react";
import classNames from "classnames";
import levenshtein from "fast-levenshtein";

export function evaluateMagicField(field, values) {
  // Check that all expected arguments have a value in the values array; otherwise, throw an error.

  // Filter magic args to only those that are defined in the values array.
  const magicArgs = field.magic.args.filter((arg) => values[arg]);
  if (magicArgs.length !== field.magic.args.length) {
    throw new Error(
      `Magic field ${field.id} expects arguments ${field.magic.args.join(
        ", "
      )} but only ${magicArgs.join(", ")} are defined in the values array.`
    );
  }

  switch (field.magic.type) {
    case "match":
      // Match expects two arguments and checks if they are equal.
      return values[field.magic.args[0]] === values[field.magic.args[1]];
    case "fuzzyMatch":
      // Fuzzy Match expects two arguments and returns the Levenshtein distance between them.
      let substitutionsRequired = levenshtein.get(
        values[field.magic.args[0]],
        values[field.magic.args[1]]
      );

      if (substitutionsRequired > 0) {
        return `${substitutionsRequired} difference${
          substitutionsRequired > 1 ? "s" : ""
        }`;
      } else {
        return true;
      }
    default:
      throw new Error(
        `Unknown magic type: ${field.magic.type} in field ${field.id}`
      );
  }
}

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
            // eslint-disable-next-line array-callback-return
            props.fields.map((field, index) => {
              // Check if there are errors for this field—if so, highlight the field in red.
              let formFieldClass =
                "rounded-lg border border-gray-200 border-2 block py-2 px-3 text-md mt-1 w-full";

              if (field.type === "checkbox-group") {
                // Checkbox groups have many options, and each element within them should be spaced out.
                formFieldClass = classNames(formFieldClass, "space-x-4");
              }

              // if this field has units associated, we remove the right border and rounding so that a span hint can show it
              if (field.units) {
                formFieldClass = classNames(
                  formFieldClass,
                  "rounded-r-none border-r-0"
                );
              }

              if (errors[field.id] && touched[field.id]) {
                formFieldClass = classNames(
                  formFieldClass,
                  "border-red-500 border-2"
                );
              }

              // Check if this form field is magic; if so, calculate its value.
              if (field.magic) {
                let magicValue;
                try {
                  magicValue = evaluateMagicField(field, values);
                } catch (error) {
                  // if the magic field fails to evaluate, we'll just set it as empty and not log an error.
                  magicValue = "";
                }
                values[field.id] = magicValue;
                // We also will highlight the form field in red or green.
                if (magicValue === true) {
                  formFieldClass = classNames(formFieldClass, "bg-green-100");
                } else if (magicValue === false) {
                  formFieldClass = classNames(formFieldClass, "bg-red-100");
                } else {
                  formFieldClass = classNames(formFieldClass, "bg-gray-100");
                }
              }

              if (
                field.type === "text" ||
                field.type === "number" ||
                field.type === "select" ||
                field.type === "checkbox"
              ) {
                return (
                  <div key={index}>
                    <label
                      htmlFor={field.id}
                      className="block text-md font-bold text-gray-700"
                    >
                      {field.label}
                      <div className={"flex"}>
                        <Field
                          id={field.id}
                          as={field.type === "select" ? "select" : "input"}
                          type={field.type}
                          // Autofocus on the first field that can accept input
                          autoFocus={normalFields.indexOf(field) === 0}
                          innerRef={
                            normalFields.indexOf(field) === 0
                              ? firstFormFieldRef
                              : null
                          }
                          // If this field is the last field that can accept input, submit the form when the user presses tab.
                          onKeyDown={
                            normalFields.indexOf(field) ===
                            normalFields.length - 1
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
                          // If the field is magic, it shouldn't accept user input.
                          disabled={field.magic}
                          // Use the composed form field class name.
                          className={formFieldClass}
                        >
                          {
                            // If the field is a select, we also need to add the options.
                            field.type === "select"
                              ? field.options.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))
                              : null
                          }
                        </Field>

                        {
                          // if this field has units, show them in a span hint
                          field.units && (
                            <span className="rounded-lg border border-gray-200 border-2 border-l-0 rounded-l-none block py-1 px-3 text-md mt-1 bg-gray-50">
                              {field.units}
                            </span>
                          )
                        }
                      </div>
                    </label>
                  </div>
                );
              } else if (field.type === "checkbox-group") {
                return (
                  <div key={index}>
                    <label className="block text-sm font-bold text-gray-700">
                      {field.label}
                    </label>
                    <div className={classNames(formFieldClass)}>
                      {field.options.map((option, index) => (
                        <label key={index}>
                          <Field
                            type="checkbox"
                            // The name should be the same across all options in this group
                            name={field.id}
                            // The value varies based on the option
                            value={option.value}
                            className={"mr-1"}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }
            })
          }

          <button
            type="submit"
            className="px-4 py-2 cursor-pointer md font-medium text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default SchemaBasedForm;
