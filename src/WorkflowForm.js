import { Field, Form, Formik } from "formik";
import React, { useRef } from "react";
import classNames from "classnames";

function WorkflowForm(props) {
  let initialValues = {};
  const firstFormFieldRef = useRef(null);

  props.schema.forEach((question) => {
    initialValues[question.id] = question.initialValue;
  });
  let userInputFields = props.schema.filter(
    (question) => question.type !== "derived"
  );
  let derivedFields = props.schema.filter(
    (question) => question.type === "derived"
  );
  return (
    <div className="shadow-xl p-4 rounded-lg">
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          props.schema.forEach((question) => {
            // Expect input for all user input fields that aren't marked optional
            if (
              !values[question.id] &&
              !question.optional &&
              question.type !== "derived"
            ) {
              errors[question.id] = "This field is required";
            }
          });
          return errors;
        }}
        onSubmit={async (values, { resetForm }) => {
          let results = {};

          // Get results for user-input fields from the form
          userInputFields.forEach((question) => {
            results[question.id] = values[question.id];
          });

          // Calculate results for derived fields based on user-input fields
          derivedFields.forEach((question) => {
            results[question.id] = question.formula(
              ...question.sources.map((source) => values[source])
            );
          });

          // Return the results to the workflow session
          props.submissionCallback({
            ...results,
            timestamp: new Date(),
          });

          // Clear values
          resetForm();

          // Focus on first form field
          if (firstFormFieldRef.current) {
            firstFormFieldRef.current.focus();
          }
        }}
      >
        {({ isSubmitting, errors, touched, values, submitForm }) => (
          <Form className="space-y-4">
            {
              // create one form field for every field in the schema
              props.schema.map((question, index) => {
                if (question.type !== "derived") {
                  return (
                    <div key={index}>
                      <label
                        htmlFor={question.id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {question.label}
                      </label>
                      <Field
                        id={question.id}
                        // Autofocus on the first field that can accept input
                        autoFocus={userInputFields.indexOf(question) === 0}
                        innerRef={
                          userInputFields.indexOf(question) === 0
                            ? firstFormFieldRef
                            : null
                        }
                        // If this field is the last field that can accept input, submit the form when the user presses tab.
                        onKeyDown={
                          userInputFields.indexOf(question) ===
                          userInputFields.length - 1
                            ? (e) => {
                                if (e.key === "Tab") {
                                  e.preventDefault();
                                  submitForm();
                                }
                              }
                            : null
                        }
                        name={question.id}
                        placeholder={question.placeholder}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 border-2 rounded-md py-2 px-3"
                      />

                      {
                        // if the user has interacted with this field, but it's not validated, show an error
                        errors[question.id] && touched[question.id] && (
                          <div className={"text-sm text-red-500 font-semibold"}>
                            {errors[question.id]}
                          </div>
                        )
                      }
                    </div>
                  );
                } else {
                  // Calculate the value for the derived field by running the given formula with the values of the sources
                  let formulaResult = question.formula(
                    ...question.sources.map((source) => values[source])
                  );
                  return (
                    <div key={index}>
                      <label
                        htmlFor={question.id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {question.label}
                      </label>
                      <div
                        id={question.id}
                        className={classNames(
                          "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 border-2 rounded-md py-2 px-3",
                          // If the formula returns true or false, color-code the output field
                          formulaResult === true &&
                            "text-green-700 bg-green-200",
                          formulaResult === false && "text-red-700 bg-red-200"
                        )}
                      >
                        <p>{formulaResult.toString()}</p>
                      </div>
                    </div>
                  );
                }
              })
            }

            {isSubmitting ? (
              <button
                disabled
                type="button"
                className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
              >
                <svg
                  role="status"
                  className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
                Processing...
              </button>
            ) : (
              <button
                type="submit"
                className="py-2.5 cursor-pointer px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
              >
                Submit
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default WorkflowForm;
