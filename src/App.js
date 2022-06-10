import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import { PrinterIcon, SupportIcon } from "@heroicons/react/solid";
import WorkflowTemplates from "./Data/WorkflowTemplates";
import ConfirmModal from "./Components/Modals/ConfirmModal";
import { createSetupFormFields } from "./Data/SetupFormTemplate";
import { WorkflowView } from "./Views/WorkflowView";
import { setupView } from "./Views/SetupView";
import Papa from "papaparse";
import { debug } from "./Data/SimpleLogger";
import { exportDBAsJSON } from "./Data/db";

function App() {
  window.onerror = (message, file, line, column, errorObject) => {
    debug("Uncaught error:", {
      message: message,
      file: file,
      line: line,
      column: column,
      errorStack: errorObject.stack,
    });

    //the error can still be triggered as usual, we just wanted to know what's happening on the client side
    return false;
  };

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

  useEffect(() => {
    debug("App loaded", {
      submissions: submissions,
      barcodes: barcodes,
      workflow: workflow,
      metadata: metadata,
    });
  }, []);

  function addSubmission(submission) {
    setSubmissions([...submissions, submission]);
    debug("Added submission", submission);
  }

  function addBarcode(barcode) {
    setBarcodes([...barcodes, barcode]);
    debug("Barcode added", barcode);
  }
  function removeBarcode(index) {
    let newBarcodes = [...barcodes];
    newBarcodes.splice(index, 1);
    debug("Barcode removed", barcodes[index]);
    setBarcodes(newBarcodes);
  }
  function clearAllBarcodes() {
    setBarcodes([]);
    debug("All barcodes cleared");
  }

  function downloadCSV(csv, title) {
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `${title}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    downloadCSV(
      Papa.unparse(results),
      `${metadata.username}_${metadata.refNumber}_${metadata.workflow}`
    );

    debug("Exported submissions as CSV", results);
  }

  function exportBarcodesAsCSV(submissions) {
    let barcodes = [
      [
        // add a stringified representation of the metadata as the first element in the CSV
        JSON.stringify(metadata),
        ...submissions.map((submission) => {
          return submission["data"];
        }),
      ],
    ];

    downloadCSV(Papa.unparse(barcodes), "barcodes");

    debug("Exported barcodes as CSV", barcodes);
  }
  function clearAllState() {
    setSubmissions([]);
    setBarcodes([]);
    setMetadata(null);
    setWorkflow(null);

    debug("Cleared all state");
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
                  <>
                    <h1 className={"font-bold text-lg"}>
                      {workflow.name} - ref. {metadata.refNumber}
                    </h1>
                    <WorkflowView
                      workflow={workflow}
                      submissionCallback={addSubmission}
                      submissions={submissions}
                      deleteSubmission={(index) => {
                        debug("Deleted submission", submissions[index]);
                        setSubmissions(
                          submissions.filter((_, i) => i !== index)
                        );
                      }}
                      onClick={() => {
                        exportSubmissionsAsCSV(submissions, metadata);
                        debug("Showing confirm modal");
                        NiceModal.show(ConfirmModal, {
                          title: "Are you sure?",
                          message: `This will clear ${submissions.length} submissions and ${barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                          action: "End job",
                          onAction: clearAllState.bind(this),
                        });
                      }}
                    />
                  </>
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
            debug("Showing print modal");
          }}
          type="button"
          className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PrinterIcon width={20} className="mr-1" />
          Print barcodes
        </button>
        <button
          onClick={() => {
            debug("Exporting database");
            debug("Snapshot of current state:", {
              submissions: submissions,
              barcodes: barcodes,
              workflow: workflow,
              metadata: metadata,
            });

            exportDBAsJSON();
          }}
          type="button"
          className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SupportIcon width={20} className={"mr-1"} />
          Export technical log information
        </button>
      </div>
    </>
  );
}

export default App;
