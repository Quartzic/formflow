import {useEffect, useState} from "react";
import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import {PrinterIcon, SupportIcon} from "@heroicons/react/solid";
import ConfirmModal from "./Components/Modals/ConfirmModal";
import {WorkflowView} from "./Views/WorkflowView";
import Papa from "papaparse";
import {debug, error, info} from "./Data/SimpleLogger";
import {exportDBAsJSON} from "./Data/db.js";
import lockup from "./Logo/lockup.svg";
import {setupView} from "./Views/SetupView";
import {createSetupFormFields} from "./Data/SetupFormTemplate";
import WorkflowTemplates from "./Data/WorkflowTemplates";

const appVersion = require("../package.json").version;

function App() {
  window.onerror = (message, file, line, column, errorObject) => {
    error(`Uncaught error: ${errorObject.message}`, {
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
    info(`Loaded app with version ${appVersion}`);
    pushAppStateToLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addSubmission(submission) {
    setSubmissions([...submissions, submission]);
    info("Added submission", submission);
  }

  function addBarcode(barcode) {
    setBarcodes([...barcodes, barcode]);
    info("Added barcode", barcode);
  }
  function removeBarcode(index) {
    let newBarcodes = [...barcodes];
    newBarcodes.splice(index, 1);
    info("Removed barcode", barcodes[index]);
    setBarcodes(newBarcodes);
  }
  function clearAllBarcodes() {
    setBarcodes([]);
    info("Cleared all barcodes");
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

        // add metadata to each record; we do this before adding the submission timestamp because the metadata timestamp needs to be overwritten
        ...metadata,

        // replace the submission timestamp with an excel-compatible one
        timestamp: new Date(submission.timestamp).toLocaleString("en-US"),
      };
    });

    // export results as CSV
    downloadCSV(
      Papa.unparse(results),
      `${metadata.username}_${metadata.refNumber}_${metadata.workflow}`
    );

    info("Exported submissions as CSV", results);
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

    info("Exported barcodes as CSV", barcodes);
  }
  function clearAllState() {
    setSubmissions([]);
    setBarcodes([]);
    setMetadata(null);
    setWorkflow(null);

    info("Cleared all state");
  }
  function pushAppStateToLog() {
    debug("Taking snapshot of current application state", {
      submissions: submissions,
      barcodes: barcodes,
      workflow: workflow,
      metadata: metadata,
    });
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
      <div
        className={
          "flex flex-col items-center md:justify-center p-5 md:h-screen w-full max-h-screen"
        }
      >
        <img src={lockup} className="w-64 pointer-events-none" alt={"Formflow logo"} />
        {metadata && (
          <h1 className={"font-bold text-xl text-center mt-3"}>
            {workflow.name} - ref. {metadata.refNumber}
          </h1>
        )}
        {metadata ? (
          <div className="p-4 w-full max-w-4xl shadow-lg m-4 rounded-lg flex-1 md:h-0">
            <WorkflowView
              workflow={workflow}
              submissionCallback={addSubmission}
              submissions={submissions}
              deleteSubmission={(index) => {
                debug("Deleted submission", submissions[index]);
                setSubmissions(submissions.filter((_, i) => i !== index));
              }}
              onClick={() => {
                exportSubmissionsAsCSV(submissions, metadata);
                debug("Opened confirm modal");
                NiceModal.show(ConfirmModal, {
                  title: "Are you sure?",
                  message: `This will clear ${submissions.length} submissions and ${barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                  action: "End job",
                  onAction: clearAllState.bind(this),
                });
              }}
            />
          </div>
        ) : (
          <div className="p-4 w-full max-w-lg shadow-lg m-4 rounded-lg">
            {setupView(
              createSetupFormFields(WorkflowTemplates),
              WorkflowTemplates,
              setMetadata,
              setWorkflow
            )}
          </div>
        )}
        <div className="sm:flex justify-center items-end">
          <button
            onClick={() => {
              NiceModal.show("print-modal");
              debug("Opened print modal");
            }}
            type="button"
            className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PrinterIcon width={20} className="mr-1" />
            Print barcodes
          </button>
          <button
            onClick={() => {
              pushAppStateToLog();
              debug("Exported technical log information");
              exportDBAsJSON();
            }}
            type="button"
            className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SupportIcon width={20} className={"mr-1"} />
            Export technical log information
          </button>
        </div>
        <p className={"text-xs text-gray-500 mt-3"}>
          {appVersion}
        </p>
      </div>
    </>
  );
}

export default App;
