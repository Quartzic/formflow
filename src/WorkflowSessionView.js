import { Component } from "react";
import WorkflowForm from "./WorkflowForm";
import { ArrowLeftIcon, DownloadIcon, TrashIcon } from "@heroicons/react/solid";
import ReactTimeAgo from "react-time-ago";
import ConfirmModal from "./Modals/ConfirmModal";
import NiceModal from "@ebay/nice-modal-react";

class SubmissionHistoryView extends Component {
  HistoryItem(submission, index) {
    return (
      <li className="py-3" key={index}>
        <div className="flex space-x-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                <ReactTimeAgo
                  date={Date.parse(submission.timestamp)}
                  locale="en-US"
                />
              </h3>
            </div>
            <ul>
              {Object.keys(submission)
                .filter((a) => {
                  return a !== "timestamp";
                })
                .map((key, index) => (
                  <li key={index}>
                    <p className="text-sm text-gray-500">
                      {key}: {submission[key].toString()}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  render() {
    let displayLimit = 3;
    // show submissions in reverse chronological order
    let submissionsToDisplay = this.props.submissions
      .reverse()
      .slice(0, displayLimit);

    if (submissionsToDisplay.length > 0) {
      return (
        <div className={"mt-4"}>
          <h1 className={"text-lg font-bold"}>
            Recent Submissions ({this.props.submissions.length} total)
          </h1>
          <ul className="divide-y divide-gray-200">
            {submissionsToDisplay.map((submission, index) =>
              this.HistoryItem(submission, index)
            )}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}

export class WorkflowSessionView extends Component {
  // setup state
  render() {
    return (
      <>
        <div className="flex justify-center">
          <div className="p-4 w-full sm:w-2/3 max-w-xl shadow-lg m-4 sm:m-8 rounded-lg">
            <div className={"text-center"}>
              <h1 className="text-lg font-bold">
                {this.props.product.name}: {this.props.workflow.name}
              </h1>
              <p className={`text-sm text-gray-600`}>
                {this.props.sessionConfig.userName} working on ref. {""}
                {this.props.sessionConfig.referenceNumber}
              </p>
            </div>

            <WorkflowForm
              schema={this.props.workflow.schema}
              submissionCallback={this.props.submissionCallback}
            />
            <SubmissionHistoryView
              submissions={this.props.submissions}
              schema={this.props.workflow.schema}
            />
            <div className={"mt-4 space-x-2"}>
              {" "}
              <button
                onClick={this.props.undoSubmission}
                type="button"
                className="inline-flex items-center mt-2  px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeftIcon width={20} className="mr-1" />
                Undo
              </button>
              <button
                onClick={this.props.downloadResults}
                type="button"
                className="inline-flex items-center mt-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <DownloadIcon width={20} className="mr-1" />
                Download results
              </button>
              <button
                onClick={() => {
                  if (this.props.submissions.length > 0) {
                    this.props.downloadResults();
                    NiceModal.show(ConfirmModal, {
                      title: "Are you sure?",
                      message: `This will clear ${this.props.submissions.length} submissions and ${this.props.barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                      action: "End job",
                      onAction: () => {
                        this.props.clearAllState();
                      },
                    });
                  } else {
                    this.props.clearAllState();
                  }
                }}
                type="button"
                className="inline-flex items-center mt-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon width={20} className="mr-1" />
                End job
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
