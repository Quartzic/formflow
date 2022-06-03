import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SetupForm from "./SetupForm.js";
import Papa from "papaparse";
import { WorkflowSessionView } from "./WorkflowSessionView";
import { schema } from "./Schema.js";
import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Modals/PrintModal";
import { PrinterIcon } from "@heroicons/react/solid";

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

  const [barcodes, setBarcodes] = useState(
    localStorage.getItem("barcodes") === null
      ? []
      : JSON.parse(localStorage.getItem("barcodes"))
  );

  useEffect(() => {
    localStorage.setItem("barcodes", JSON.stringify(barcodes));
  }, [barcodes]);

  function addBarcode(barcode) {
    setBarcodes([...barcodes, barcode]);
  }
  function removeBarcode(index) {
    let newBarcodes = [...barcodes];
    newBarcodes.splice(index, 1);
    setBarcodes(newBarcodes);
  }
  function clearAllBarcodes() {
    setBarcodes([]);
  }

  function exportSubmissionsAsCSV() {
    let results = {
      workflow:
        schema[sessionConfig.productIndex].members[sessionConfig.workflowIndex]
          .name,
      product: schema[sessionConfig.productIndex].name,
      userName: sessionConfig.userName,
      referenceNumber: sessionConfig.referenceNumber,
      submissions: submissions.map((submission) => {
        return {
          ...submission,

          // replace the timestamp with an excel-compatible one
          timestamp: submission.timestamp.toLocaleString("en-US"),

          // add metadata to each record
          product: schema[sessionConfig.productIndex].name,
          workflow:
            schema[sessionConfig.productIndex].members[
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
  function exportBarcodesAsCSV() {
    let csv = Papa.unparse([barcodes]);
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `barcodes_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function clearAllState() {
    setSubmissions([]);
    setSessionConfig(null);
    setBarcodes([]);
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            sessionConfig ? (
              <WorkflowSessionView
                sessionConfig={sessionConfig}
                product={schema[sessionConfig.productIndex]}
                workflow={
                  schema[sessionConfig.productIndex].members[
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
                barcodes={barcodes}
              />
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-4 md:w-1/2 shadow-lg m-8 rounded-lg">
                    <SetupForm
                      submissionCallback={setSessionConfig}
                      schema={schema}
                    />
                  </div>
                </div>
              </>
            )
          }
        />
        <Route path="about" element={"About"} />
      </Routes>
      <div className="flex justify-center items-end">
        <PrintModal
          id="print-modal"
          barcodes={barcodes}
          addBarcode={addBarcode}
          removeBarcode={removeBarcode}
          clearAllBarcodes={clearAllBarcodes}
          exportBarcodesAsCSV={exportBarcodesAsCSV}
        />
        <button
          onClick={() => {
            NiceModal.show("print-modal");
          }}
          type="button"
          className="inline-flex items-center m-3 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PrinterIcon width={20} className="mr-1" />
          Print barcodes
        </button>
      </div>
    </>
  );
}

export default App;
