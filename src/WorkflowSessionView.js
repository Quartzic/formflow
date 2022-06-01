import { Component, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import WorkflowForm from "./WorkflowForm";
import { ArrowLeftIcon, DownloadIcon, TrashIcon } from "@heroicons/react/solid";
import ReactTimeAgo from "react-time-ago";

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
                      {key}: {submission[key]}
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
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        open: false,
        title: "",
        message: "",
        action: "",
        confirmCallback: null,
      },
    };
  }

  closeModal() {
    this.setState({
      modal: {
        ...this.state.modal,
        open: false,
      },
    });
  }

  // setup state
  render() {
    return (
      <>
        <Transition.Root show={this.state.modal.open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={this.closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          {this.state.modal.title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {this.state.modal.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {
                          this.state.modal.confirmCallback();
                          this.closeModal();
                        }}
                      >
                        {this.state.modal.action}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={this.closeModal.bind(this)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="flex justify-center">
          <div className="p-4 w-full sm:w-2/3 max-w-lg shadow-lg m-4 sm:m-8 rounded-lg">
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
                    this.setState({
                      modal: {
                        open: true,
                        title: "Are you sure?",
                        message: `This will clear ${this.props.submissions.length} submissions and reset the application to its original state. Make sure you've downloaded your work first.`,
                        action: "End job",
                        confirmCallback: this.props.clearAllState,
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
