import { Component } from "react";
import ReactTimeAgo from "react-time-ago";

export class SubmissionHistoryView extends Component {
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

export default SubmissionHistoryView;
