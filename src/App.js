import { ArrowLeftIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/solid';
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SetupForm from "./SetupForm.js";
import WorkflowForm from "./WorkflowForm.js";

function App() {

  const [submissions, setSubmissions] = useState(localStorage.getItem('submissions') === null ? [] : JSON.parse(localStorage.getItem('submissions')));

  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions])


  const [sessionConfig, setSessionConfig] = useState(localStorage.getItem('sessionConfig') === null ? null : JSON.parse(localStorage.getItem('sessionConfig')));

  useEffect(() => {
    localStorage.setItem("sessionConfig", JSON.stringify(sessionConfig));
  }, [sessionConfig])
  function addSubmission(submission) {
    setSubmissions([
      ...submissions,
      submission
    ]
    )
  }

  return (
    <Routes>
      <Route path="/" element={
        sessionConfig ?
          <>
            <div className="flex justify-center">
              <div className="p-4 sm:w-1/2 shadow-lg m-8 rounded-lg">
                <p>{sessionConfig.userName} is working on a job with reference number {sessionConfig.referenceNumber}.</p>
                <WorkflowForm questions={
                  [
                    {
                      id: 'sku',
                      label: 'SKU',
                      type: 'text',
                      initialValue: '',
                      placeholder: '64543543'
                    },
                    {
                      id: 'quantity',
                      label: 'Quantity',
                      type: 'number',
                      initialValue: '1',
                      placeholder: '1'
                    },
                    {
                      id: 'position',
                      label: 'Position',
                      type: 'text',
                      initialValue: '',
                      placeholder: '33A1B3'
                    }
                  ]
                } submissionCallback={addSubmission} />
                <div className="mt-4 space-y-2">
                  {submissions.map(
                    (submission, index) => {
                      return <p key={index}>
                        {submission.timestamp}: {submission.quantity} item of SKU {submission.sku} stored in {submission.position}
                      </p>
                    }
                  )}
                </div>
                <button onClick={() => { setSubmissions(submissions.slice(0, -1)) }} type="button" className="inline-flex items-center mr-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <ArrowLeftIcon width={20} className="mr-1" />
                  Undo
                </button>
                <button onClick={() => { setSubmissions([]) }} type="button" className="inline-flex items-center mx-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <TrashIcon width={20} className="mr-1" />
                  Clear
                </button>
                <button onClick={() => { alert(JSON.stringify(sessionConfig) + JSON.stringify(submissions)); setSubmissions([]); setSessionConfig(null); }} type="button" className="inline-flex items-center mx-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <CheckCircleIcon width={20} className="mr-1" />
                  Complete job
                </button>
              </div>
            </div>
          </> : <>
            <div className="flex justify-center">
              <div className="p-4 sm:w-1/2 shadow-lg m-8 rounded-lg">
                <SetupForm submissionCallback={setSessionConfig} />
              </div>
            </div>
          </>} />
      <Route path="about" element={"About"} />
    </Routes>

  );
}

export default App;
