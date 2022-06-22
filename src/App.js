import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import {PrinterIcon, SupportIcon} from "@heroicons/react/solid";
import ConfirmModal from "./Components/Modals/ConfirmModal";
import {WorkflowView} from "./Views/WorkflowView";
import Papa from "papaparse";
import {exportDBAsJSON} from "./Data/db.js";
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

const appVersion = require("../package.json").version;
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
  const submissions = useSelector((state) => state.submissions.present);
  const barcodes = useSelector((state) => state.barcodes.present);
  const metadata = useSelector((state) => state.metadata);
  const workflow = useSelector((state) => state.workflow);

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
              submissionCallback={
                (submission) => {dispatch(submissionsSlice.actions.add(submission))}}
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

                  }
                });
              }}
            />
          </div>
        ) : (
          <div className="p-4 w-full max-w-lg shadow-lg m-4 rounded-lg">
            {setupView(
              createSetupFormFields(WorkflowTemplates),
              WorkflowTemplates,
              (metadata)  => {
                dispatch(metadataSlice.actions.set(metadata));
                Sentry.setUser({username: metadata.username});
              },
                (workflow)  => {
                  dispatch(workflowSlice.actions.set(workflow));
                },
            )}
          </div>
        )}
        <div className="sm:flex justify-center items-end">
          <button
            onClick={() => {
              NiceModal.show("print-modal");
            }}
            type="button"
            className="inline-flex items-center m-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PrinterIcon width={20} className="mr-1" />
            Print barcodes
          </button>
          <button
            onClick={() => {
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
