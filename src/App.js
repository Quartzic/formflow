import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import {PrinterIcon} from "@heroicons/react/solid";
import ConfirmModal from "./Components/Modals/ConfirmModal";
import {WorkflowView} from "./Views/WorkflowView";
import Papa from "papaparse";
import lockup from "./Logo/lockup.svg";
import {setupView} from "./Views/SetupView";
import {createSetupFormFields} from "./Data/SetupFormTemplate";
import WorkflowTemplates from "./Data/WorkflowTemplates";
import {useDispatch, useSelector} from "react-redux";
import submissionsSlice from "./Redux/submissionsSlice";
import barcodesSlice from "./Redux/barcodesSlice";
import metadataSlice from "./Redux/metadataSlice";
import workflowSlice from "./Redux/workflowSlice";
import * as Sentry from "@sentry/react";
import {toast, ToastContainer} from "react-toastify";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import posthog from 'posthog-js';
import {addSubmissionToDBOrQueue} from "./Data/postgrest";
import ConnectionStatus from "./Components/ConnectionStatus";
import databaseQueueSlice from "./Redux/databaseQueueSlice";
import classNames from "classnames";

const appVersion = require("../package.json").version;

posthog.init("phc_cQmnFnVzHM75RTp2mzOB7GbZDtjsSi8GFDbFEnRDhqD", {api_host: 'https://app.posthog.com'});
posthog.register({
  environment: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "development" : "production",
  version: appVersion
})

function preprocessSubmissionsForCSVExport(submissions, metadata) {
  return submissions.map((submission) => {
    return {
      ...submission,

      // add metadata to each record; we do this before adding the submission timestamp because the metadata timestamp needs to be overwritten
      ...metadata,

      // replace the submission timestamp with an excel-compatible one
      timestamp: new Date(submission.timestamp).toLocaleString("en-US"),
    };
  });
}

function App() {

  const dispatch = useDispatch();
  const submissions = useSelector((state) => state.submissions);
  const barcodes = useSelector((state) => state.barcodes);
  const metadata = useSelector((state) => state.metadata);
  const workflow = useSelector((state) => state.workflow);

  /*
  useMousetrap(["ctrl+z", "command+z"], () => {

    if(store.getState().past.length > 0) {

      dispatch(UndoActionCreators.undo())
      toast(
          <p className={"text-gray-900 text-lg"}>
            Undid an action
            <br/>
            <p className={"text-xs text-gray-500"}>Press <kbd>Ctrl+Y</kbd> to redo</p>
          </p>);
    }else{
        toast(
            "No more actions to undo")
      }

    });
  useMousetrap(["ctrl+y", "command+shift+z"], () => {
    if(store.getState().future.length > 0) {
      dispatch(UndoActionCreators.redo())
      toast(
          <p className={"text-gray-900 text-lg"}>
            Redid an action
            <br/>
            <p className={"text-xs text-gray-500"}>Press <kbd>Ctrl+Z</kbd> to undo</p>
          </p>);
    }else{
        toast("Nothing to redo", {type: "error"});
    }
  });
*/

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
    // We need to apply metadata to the submissionsSlice
    let results = preprocessSubmissionsForCSVExport(submissions, metadata);

    // export results as CSV
    downloadCSV(
      Papa.unparse(results),
      `${metadata.username}_${metadata.refNumber}_${metadata.workflow}`
    );

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

  }
  return (
    <>
      <ConnectionStatus />
      <PrintModal
        id="print-modal"
        barcodes={barcodes}
        addBarcode={(barcode) => {
          dispatch(barcodesSlice.actions.add(barcode));
        }
        }
        removeBarcode={(barcode) => {
          dispatch(barcodesSlice.actions.remove(barcode));
        }
        }
        clearAllBarcodes={() => {
          dispatch(barcodesSlice.actions.clear());}
        }
        exportBarcodesAsCSV={() => {
          exportBarcodesAsCSV(barcodes);
        }}
      />
      <div
        className={
          "flex flex-col items-center md:justify-center p-5 md:h-screen w-full max-h-screen"
        }
      >
        <img src={lockup} className="w-52 pointer-events-none" alt={"Formflow logo"}  />
          <div className={classNames("p-4 w-full shadow-lg m-4 rounded-lg", (metadata && workflow) ? "max-w-4xl md:h-0 flex-1" : "max-w-lg")}>

            {metadata && workflow ? (
            <WorkflowView
              workflow={workflow}
              metadata={metadata}
              submissionCallback={
                (submission) => {
                  dispatch(submissionsSlice.actions.add(submission))
                  addSubmissionToDBOrQueue(submission, metadata);
                  }}
              submissions={submissions}
              deleteSubmission={(index) => {
                dispatch(submissionsSlice.actions.remove(index));
              }}
              onClick={() => {
                exportSubmissionsAsCSV(submissions, metadata);
                NiceModal.show(ConfirmModal, {
                  title: "Are you sure?",
                  message: `This will clear ${submissions.length} submissions and ${barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                  action: "End job",
                  onAction: () => {
                    dispatch(submissionsSlice.actions.clear());
                    dispatch(barcodesSlice.actions.clear());
                    dispatch(metadataSlice.actions.clear());
                    dispatch(workflowSlice.actions.clear());
                    dispatch(databaseQueueSlice.actions.clear());
                  }
                });
              }}
            />

            ) : (
            setupView(
              createSetupFormFields(WorkflowTemplates),
              WorkflowTemplates,
              (metadata)  => {
                dispatch(metadataSlice.actions.set(metadata));
                Sentry.setUser({username: metadata.username});
              },
                (workflow)  => {
                  dispatch(workflowSlice.actions.set(workflow));
                },
            )
        )}
          </div>
        <div className="sm:flex justify-center items-end">
          <button
            onClick={() => {
              NiceModal.show("print-modal");
            }}
            type="button"
            className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105 hover:shadow-md transition-all"
          >
            <PrinterIcon width={20} className="mr-1" />
            Print barcodes
          </button>
        </div>
        <p className={"text-xs text-gray-500 mt-3"}>
          {appVersion}
        </p>
      </div>

      <ToastContainer position="top-right"
                      autoClose={1500}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      hideProgressBar={true}
                      closeButton={false}
                      pauseOnHover />
    </>
  );
}

export default App;
