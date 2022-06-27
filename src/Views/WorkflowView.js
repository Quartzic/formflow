import SchemaBasedForm from "../Components/SchemaBasedForm";
import {CheckCircleIcon} from "@heroicons/react/solid";
import SubmissionHistoryView from "../Components/SubmissionHistoryView";

export function WorkflowView(props) {
  return (
    <>
      <div className={"md:flex gap-12 flex-1 md:h-full space-y-10 md:space-y-0"}>
        <div className={"flex flex-col"}>
          <div className={"flex-1"}>
            <SchemaBasedForm
              fields={props.workflow.submissionFields}
              submissionCallback={props.submissionCallback}
            />
          </div>

          <button
            onClick={props.onClick}
            type="button"
            className="w-32 justify-center inline-flex items-center mt-5 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckCircleIcon width={20} className="mr-1" />
            End job
          </button>
        </div>
        <div className={"h-96 md:h-full md:flex-1 overflow-y-auto"}>
          {props.submissions && (
            <SubmissionHistoryView
              submissions={props.submissions}
              deleteSubmission={props.deleteSubmission}
            />
          )}
        </div>
      </div>
    </>
  );
}
