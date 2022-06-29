import React, {Component} from "react";
import ReactTimeAgo from "react-time-ago";
import classNames from "classnames";
import {Transition} from "@headlessui/react";
import {XIcon} from "@heroicons/react/solid";

export class SubmissionHistoryView extends Component {
    HistoryItem(submission, index, deleteSubmission, keysToLabelsMap) {
        // Show all keys in the history item, except for the timestamp and original index.
        let shownKeys = Object.keys(submission).filter(
            (key) => key !== "timestamp" && key !== "originalIndex"
        );

        // check if the submission has as "matches" key, and if it's true or false, apply color-coding
        let submissionColor = "";
        switch (submission.matches) {
            case true:
                submissionColor = "bg-green-100";
                break;
            case false:
                submissionColor = "bg-red-100";
                break;
            default:
                submissionColor = "bg-gray-100";
                break;

        }
        return (
            <Transition as={React.Fragment} key={submission['originalIndex']} appear={true}
                        show={true}
                        enter="transition origin-center duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100 ">
                <li className={""}>
                    <div className={classNames("flex justify-between rounded-lg gap-6 p-3 relative", submissionColor)}>
                        <button
                            onClick={deleteSubmission}
                            className={"absolute -right-2 -top-2 bg-gray-500 rounded-full p-1 shadow-lg rounded hover:bg-red-500 hover:scale-125 transition-all"}
                        >
                            <XIcon className={"text-white"} width={18}/>
                        </button>
                        <div className={"min-w-0 flex-1 flex-shrink"}>
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
                                                    className={"text-sm font-medium inline-block ph-no-capture text-gray-500"}
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
                        <div className="flex-shrink flex-col self-end">
                                <ReactTimeAgo
                                    date={Date.parse(submission.timestamp)}
                                    locale="en-US"
                                    className={"h-min text-sm text-gray-700"}
                                />
                        </div>
                    </div>
                </li>
            </Transition>
        );
    }

    render() {
        // Because the history view may not show elements in the original order, we apply the element's original index so that we can pass it back if Delete is clicked.
        let submissions = this.props.submissions.map((submission, index) => {
            return {...submission, originalIndex: index};
        });

        // show submissionsSlice in reverse chronological order
        let submissionsToDisplay = submissions.reverse();

        if (submissionsToDisplay.length > 0) {

            return (
                <>
                    {!this.props.compact && <h1 className={"text-lg font-bold"}>
                        Recent Submissions ({this.props.submissions.length} total)
                    </h1>}
                    <ul className={classNames("space-y-4 my-2", !this.props.compact && "pr-6")}>
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
