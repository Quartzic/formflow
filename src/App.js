import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SetupForm from "./SetupForm.js";
import Papa from "papaparse";
import { WorkflowSessionView } from "./WorkflowSessionView";

function App() {
  const [submissions, setSubmissions] = useState(
    localStorage.getItem("submissions") === null
      ? []
      : JSON.parse(localStorage.getItem("submissions"))
  );

  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions]);

  const [sessionConfig, setSessionConfig] = useState(
    localStorage.getItem("sessionConfig") === null
      ? null
      : JSON.parse(localStorage.getItem("sessionConfig"))
  );

  useEffect(() => {
    localStorage.setItem("sessionConfig", JSON.stringify(sessionConfig));
  }, [sessionConfig]);

  function addSubmission(submission) {
    setSubmissions([...submissions, submission]);
  }

  function exportSubmissionsAsCSV() {
    let results = {
      workflow:
        manifest[sessionConfig.productIndex].members[
          sessionConfig.workflowIndex
        ].name,
      product: manifest[sessionConfig.productIndex].name,
      userName: sessionConfig.userName,
      referenceNumber: sessionConfig.referenceNumber,
      submissions: submissions.map((submission) => {
        return {
          ...submission,

          // replace the timestamp with an excel-compatible one
          timestamp: submission.timestamp.toLocaleString("en-US"),

          // add metadata to each record
          product: manifest[sessionConfig.productIndex].name,
          workflow:
            manifest[sessionConfig.productIndex].members[
              sessionConfig.workflowIndex
            ].name,
          userName: sessionConfig.userName,
          referenceNumber: sessionConfig.referenceNumber,
        };
      }),
    };

    // export results as CSV
    let csv = Papa.unparse(results.submissions);
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `${results.userName}_${results.referenceNumber}_${
      results.workflow
    }_${results.product}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAllState() {
    setSubmissions([]);
    setSessionConfig(null);
  }

  let manifest = [
    {
      // Product
      name: "Distribution",
      members: [
        {
          // Workflow
          name: "Inbound",
          // Definition for this workflow's form fields
          schema: [
            {
              id: "sku",
              label: "SKU",
              type: "text",
              initialValue: "",
              placeholder: "64543543",
            },
            {
              id: "quantity",
              label: "Quantity",
              type: "number",
              initialValue: "1",
              placeholder: "1",
            },
            {
              id: "position",
              label: "Position",
              type: "text",
              initialValue: "",
              placeholder: "33A1B3",
            },
          ],
        },
        {
          // Workflow
          name: "Pick",
          // Definition for this workflow's form fields
          schema: [
            {
              id: "position",
              label: "Position",
              type: "text",
              initialValue: "",
              placeholder: "33A1B3",
            },
            {
              id: "sku",
              label: "SKU",
              type: "text",
              initialValue: "",
              placeholder: "64543543",
            },
            {
              id: "quantity",
              label: "Quantity",
              type: "number",
              initialValue: "1",
              placeholder: "1",
            },
          ],
        },
        {
          // Workflow
          name: "Put Away",
          // Definition for this workflow's form fields
          schema: [
            {
              id: "sku",
              label: "SKU",
              type: "text",
              initialValue: "",
              placeholder: "64543543",
            },
            {
              id: "quantity",
              label: "Quantity",
              type: "number",
              initialValue: "1",
              placeholder: "1",
            },
            {
              id: "position",
              label: "Position",
              type: "text",
              initialValue: "",
              placeholder: "33A1B3",
            },
          ],
        },
      ],
    },
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          sessionConfig ? (
            <WorkflowSessionView
              sessionConfig={sessionConfig}
              product={manifest[sessionConfig.productIndex]}
              workflow={
                manifest[sessionConfig.productIndex].members[
                  sessionConfig.workflowIndex
                ]
              }
              submissionCallback={addSubmission}
              submissions={submissions}
              undoSubmission={() => {
                setSubmissions(submissions.slice(0, -1));
              }}
              downloadResults={exportSubmissionsAsCSV}
              clearAllState={clearAllState}
            />
          ) : (
            <>
              <div className="flex justify-center">
                <div className="p-4 md:w-1/2 shadow-lg m-8 rounded-lg">
                  <SetupForm
                    submissionCallback={setSessionConfig}
                    manifest={manifest}
                  />
                </div>
              </div>
            </>
          )
        }
      />
      <Route path="about" element={"About"} />
    </Routes>
  );
}

export default App;
