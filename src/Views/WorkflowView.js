import SchemaBasedForm from "../Components/SchemaBasedForm";
import {CheckCircleIcon} from "@heroicons/react/solid";
import SubmissionHistoryView from "../Components/SubmissionHistoryView";
import React from "react";
import {Transition} from "@headlessui/react";
import ReactTimeAgo from "react-time-ago";

export function WorkflowView(props) {
    return (
        <Transition as={React.Fragment}
                    appear={true}
                    show={true}
                    enter="transition duration-1000"
                    enterFrom="scale-50 opacity-0"
                    enterTo="scale-100 opacity-100">
            <div className={"md:flex gap-12 flex-1 md:h-full space-y-10 md:space-y-0"}>
                <div className={"flex gap-6 md:gap-0 flex-col md:flex-col-reverse justify-between"}>

                    <div className={"rounded-lg shadow-md p-3"}>
                        <h1 className={"font-bold text-lg"}>
                            Job info
                        </h1>


                        <div className={"mt-2"}>
                            <div className="py-1 grid grid-cols-2 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Username</dt>
                                <dd className="text-sm text-gray-900">{props.metadata.username}</dd>
                            </div>
                            <div className="py-1 grid grid-cols-2 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Reference number</dt>
                                <dd className="text-sm text-gray-900">{props.metadata.refNumber}</dd>
                            </div>
                            <div className="py-1 grid grid-cols-2 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Workflow</dt>
                                <dd className="text-sm text-gray-900">{props.metadata.workflow}</dd>
                            </div>
                            <div className="py-1 grid grid-cols-2 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Job started</dt>
                                <dd className="text-sm text-gray-900"><ReactTimeAgo date={props.metadata.timestamp}
                                                                                    locale={
                                                                                        "en-US"
                                                                                    }/></dd>
                            </div>
                        </div>

                        <button
                            onClick={props.onClick}
                            type="button"
                            className="w-32 justify-center inline-flex items-center mt-5 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105 hover:shadow-md transition-all"
                        >
                            <CheckCircleIcon width={20} className="mr-1"/>
                            End job
                        </button>
                    </div>
                    <SchemaBasedForm
                        fields={props.workflow.submissionFields}
                        submissionCallback={props.submissionCallback}
                    />
                </div>

                <div className={"h-96 md:h-full md:flex-1 overflow-y-auto"}>
                    {props.submissions && (
                        <SubmissionHistoryView
                            submissions={props.submissions}
                            deleteSubmission={props.deleteSubmission}
                            keysToLabelsMap={
                                Object.assign({}, ...props.workflow.submissionFields.map((field) => ({
                                    [field.id]: field.label
                                })))
                            }
                        />
                    )}
                </div>
            </div>
        </Transition>
    );
}
