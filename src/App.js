import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import { PrinterIcon } from "@heroicons/react/solid";
import WorkflowTemplates from "./Data/WorkflowTemplates";
import ConfirmModal from "./Components/Modals/ConfirmModal";
import { createSetupFormFields } from "./Data/SetupFormTemplate";
import { WorkflowView } from "./Views/WorkflowView";
import { setupView } from "./Views/SetupView";
import Papa from "papaparse";

function App() {
  const [submissions, setSubmissions] = useState(
    localStorage.getItem("submissions") === null
      ? []
      : JSON.parse(localStorage.getItem("submissions"))
  );

  const [barcodes, setBarcodes] = useState(
    localStorage.getItem("barcodes") === null
      ? []
      : JSON.parse(localStorage.getItem("barcodes"))
  );

  const [workflow, setWorkflow] = useState(
    localStorage.getItem("workflow") === null
      ? null
      : JSON.parse(localStorage.getItem("workflow"))
  );

  const [metadata, setMetadata] = useState(
    localStorage.getItem("metadata") === null
      ? null
      : JSON.parse(localStorage.getItem("metadata"))
  );

  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem("barcodes", JSON.stringify(barcodes));
  }, [barcodes]);

  useEffect(() => {
    localStorage.setItem("workflow", JSON.stringify(workflow));
  }, [workflow]);

  useEffect(() => {
    localStorage.setItem("metadata", JSON.stringify(metadata));
  }, [metadata]);

  function addSubmission(submission) {
    setSubmissions([...submissions, submission]);
  }

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

  function exportSubmissionsAsCSV(submissions, metadata) {
    // We need to apply metadata to the submissions

    let results = submissions.map((submission) => {
      return {
        ...submission,

        // replace the timestamp with an excel-compatible one
        timestamp: submission.timestamp.toLocaleString("en-US"),

        // add metadata to each record
        ...metadata,
      };
    });

    // export results as CSV
    let csv = Papa.unparse(results);
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.username}_${metadata.refNumber}_${
      metadata.workflow
    }_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportBarcodesAsCSV(submissions) {
    // this is *barely* a CSV; we just take the barcode data and comma-delimit them, then write that to a file
    let barcodes = submissions.map((submission) => {
      return submission["data"];
    });
    // comma-delimit the barcodes list
    let csv = barcodes.join(",");
    // download the CSV
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `barcodes_${metadata.timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function clearAllState() {
    setSubmissions([]);
    setBarcodes([]);
    setMetadata(null);
    setWorkflow(null);
  }

  return (
    <>
      <PrintModal
        id="print-modal"
        barcodes={barcodes}
        addBarcode={addBarcode}
        removeBarcode={removeBarcode}
        clearAllBarcodes={clearAllBarcodes}
        exportBarcodesAsCSV={() => {
          exportBarcodesAsCSV(barcodes);
        }}
      />

      <div className="flex justify-center">
        <div className="p-4 w-full md:w-2/3 xl:w-1/2 shadow-lg m-4 rounded-lg">
          <Routes>
            <Route
              path="/"
              element={
                metadata ? (
                  <WorkflowView
                    workflow={workflow}
                    submissionCallback={addSubmission}
                    submissions={submissions}
                    deleteSubmission={(index) => {
                      setSubmissions(submissions.filter((_, i) => i !== index));
                    }}
                    onClick={() => {
                      exportSubmissionsAsCSV(submissions, metadata);
                      NiceModal.show(ConfirmModal, {
                        title: "Are you sure?",
                        message: `This will clear ${submissions.length} submissions and ${barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                        action: "End job",
                        onAction: clearAllState.bind(this),
                      });
                    }}
                  />
                ) : (
                  setupView(
                    createSetupFormFields(WorkflowTemplates),
                    WorkflowTemplates,
                    setMetadata,
                    setWorkflow
                  )
                )
              }
            />
          </Routes>
        </div>
      </div>
      <div className="flex justify-center items-end">
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
