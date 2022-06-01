import { Field, Form, Formik } from "formik";
import React from "react";

const WorkflowRadioButton = ({
  field: { onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div className="relative flex items-start py-4">
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700 select-none">
          {label}
        </label>
      </div>
      <div className="ml-3 flex items-center h-5">
        <input
          name="workflow"
          id={id}
          type="radio"
          onChange={onChange}
          onBlur={onBlur}
          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          {...props}
        />
      </div>
    </div>
  );
};

function WorkflowSelector(manifest) {
  function renderProduct(product, productIndex) {
    return (
      <div className="sm:flex-auto" key={productIndex}>
        <legend className="text-lg font-medium text-gray-900">
          {product.name}
        </legend>
        <div className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
          {product.members.map((workflow, workflowIndex) => {
            return (
              <Field
                component={WorkflowRadioButton}
                id={product.name + "-" + workflow.name}
                value={productIndex + "-" + workflowIndex}
                label={workflow.name}
                key={workflowIndex}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={"sm:flex sm:flex-row sm:space-x-8"}>
      {manifest.map((product, index) => {
        return renderProduct(product, index);
      })}
    </div>
  );
}

function SetupForm(props) {
  return (
    <div className="shadow-xl p-4 rounded-lg">
      <Formik
        initialValues={{
          workflow: "",
          userName: "",
          referenceNumber: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.workflow) {
            errors.workflow = "This field is required";
          }
          if (!values.userName || values.userName.length < 1) {
            errors.userName = "This field is required";
          }
          if (!values.referenceNumber || values.referenceNumber.length < 1) {
            errors.referenceNumber = "This field is required";
          }
          return errors;
        }}
        onSubmit={async (values, { resetForm }) => {
          // parse workflow selection
          const workflow = values.workflow.split("-");
          const productIndex = parseInt(workflow[0]);
          const workflowIndex = parseInt(workflow[1]);

          props.submissionCallback({
            productIndex: productIndex,
            workflowIndex: workflowIndex,
            ...values,
          });
          // clear values
          resetForm();
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div className={"space-y-2"}>
              <h1 className={"text-2xl my-2 font-bold "}>Job Info</h1>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700"
                >
                  User Name
                </label>
                <Field
                  id="userName"
                  name="userName"
                  placeholder="Jane Doe"
                  autoComplete="false"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 border-2 rounded-md py-2 px-3"
                  required
                />
              </div>
              {touched.userName && errors.userName && (
                <div className={"text-sm text-red-500 font-semibold"}>
                  {errors.userName}
                </div>
              )}
              <div>
                <label
                  htmlFor="referenceNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference Number
                </label>
                <Field
                  id="referenceNumber"
                  name="referenceNumber"
                  placeholder="12345"
                  autoComplete="false"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 border-2 rounded-md py-2 px-3"
                  required
                />
                {touched.referenceNumber && errors.referenceNumber && (
                  <div className={"text-sm text-red-500 font-semibold"}>
                    {errors.referenceNumber}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h1 className={"text-2xl my-2 font-bold"}>Pick a workflow</h1>
              {WorkflowSelector(props.manifest)}
              {touched.workflow && errors.workflow && (
                <div className={"text-sm text-red-500 font-semibold"}>
                  {errors.workflow}
                </div>
              )}
            </div>
            {isSubmitting ? (
              <button
                disabled
                type="button"
                className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
              >
                <svg
                  role="status"
                  className="inline w-4 h-4 mr-2 text-gray-200 animate-spin "
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

export default SetupForm;
