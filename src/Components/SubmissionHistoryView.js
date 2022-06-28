import React, {Component} from "react";
import ReactTimeAgo from "react-time-ago";
import {TrashIcon} from "@heroicons/react/solid";
import classNames from "classnames";
import {Transition} from "@headlessui/react";

export class SubmissionHistoryView extends Component {
  HistoryItem(submission, index, deleteSubmission, keysToLabelsMap) {
    // Show all keys in the history item, except for the timestamp and original index.
    let shownKeys = Object.keys(submission).filter(
      (key) => key !== "timestamp" && key !== "originalIndex"
    );

    return (
        <Transition as={React.Fragment} key={submission['originalIndex']}       appear={true}
                    show={true}
                    enter="transition origin-center duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100">
      <li className="py-3">
        <div className="flex justify-between rounded-lg">
          <div className="min-w-0 flex-1">
            <ul>
              {shownKeys.length > 1 ? (
                shownKeys.map((key, index) => {
                  return (
                    <li key={index}>
                      <p className="text-sm font-semibold text-gray-900 inline">
                        {shownKeys.length > 1 && `${
                            keysToLabelsMap[key] || key
                        }: `}
                      </p>
                      <p
                        className={classNames(
                            // it's important to use ph-no-capture so that PostHog doesn't record data here
                          "text-sm font-medium inline-block ph-no-capture",
                          // if not true or false: gray text
                          (submission[key] !== true) &
                            (submission[key] !== false) && "text-gray-500",
                          // if true: green card
                          submission[key] === true &&
                            "bg-green-500 p-1 rounded-sm shadow-lg text-white",
                          // if false: red card
                          submission[key] === false &&
                            "bg-red-500 p-1 rounded-sm shadow-lg text-white"
                        )}
                      >
                        {submission[key].toString()}
                      </p>
                    </li>
                  );
                })
              ) : (
                <li key={index}>
                  <p className="text-md font-semibold text-gray-900">
                    {submission[shownKeys[0]].toString()}
                  </p>
                </li>
              )}
            </ul>
          </div>
          <div className="flex-shrink-0">
            <h3 className="text-sm text-gray-700 font-sm">
              <ReactTimeAgo
                date={Date.parse(submission.timestamp)}
                locale="en-US"
              />
            </h3>
            <button
              onClick={deleteSubmission}
              className={"float-right bg-red-500 rounded shadow px-2 py-1 hover:bg-red-600 hover:scale-105 hover:shadow-md transition-all"}
            >
              <TrashIcon className={"text-white"} width={16} />
            </button>
          </div>
        </div>
      </li>
        </Transition>
    );
  }

  render() {
    // Because the history view may not show elements in the original order, we apply the element's original index so that we can pass it back if Delete is clicked.
    let submissions = this.props.submissions.map((submission, index) => {
      return { ...submission, originalIndex: index };
    });

    // show submissionsSlice in reverse chronological order
    let submissionsToDisplay = submissions.reverse();

    if (submissionsToDisplay.length > 0) {

      return (
        <>
          { !this.props.compact && <h1 className={"text-lg font-bold"}>
            Recent Submissions ({this.props.submissions.length} total)
          </h1> }
          <ul className={classNames("divide-y divide-gray-200", !this.props.compact && "pr-6")}>
            {submissionsToDisplay.map((submission, index) =>
              this.HistoryItem(submission, index, () => {
                this.props.deleteSubmission(submission.originalIndex);
              }, this.props.keysToLabelsMap)
            )}
          </ul>
        </>
      );
    } else {
      return (
        <div
          className={
            // centered vertically and horizontally
            "flex flex-col items-center justify-center h-full py-4"
          }
        >
          <p className={"text-md text-gray-500"}>No recent submissions</p>
        </div>
      );
    }
  }
}

export default SubmissionHistoryView;
