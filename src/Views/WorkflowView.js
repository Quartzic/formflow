import SchemaBasedForm from "../Components/SchemaBasedForm";
import { CheckCircleIcon } from "@heroicons/react/solid";
import SubmissionHistoryView from "../Components/SubmissionHistoryView";

export function WorkflowView(props) {
  return (
    <>
      <SchemaBasedForm
        fields={props.workflow.submissionFields}
        submissionCallback={props.submissionCallback}
      />
      {props.submissions && (
        <SubmissionHistoryView
          submissions={props.submissions}
          deleteSubmission={props.deleteSubmission}
        />
      )}
      <button
        onClick={props.onClick}
        type="button"
        className="inline-flex items-center mt-5 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <CheckCircleIcon width={20} className="mr-1" />
        End job
      </button>
    </>
  );
}
