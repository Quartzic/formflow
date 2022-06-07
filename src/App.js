import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import PrintModal from "./Components/Modals/PrintModal";
import { PrinterIcon, TrashIcon } from "@heroicons/react/solid";
import SchemaBasedForm from "./Components/SchemaBasedForm";
import WorkflowTemplate from "./Data/WorkflowTemplate";
import { SubmissionHistoryView } from "./Components/SubmissionHistoryView";
import ConfirmModal from "./Components/Modals/ConfirmModal";

let setupFormFields = [
  {
    id: "username",
    label: "Username",
    type: "text",
    initialValue: "",
    placeholder: "Jane Doe",
  },
  {
    id: "refnumber",
    label: "Reference Number",
    type: "text",
    initialValue: "",
    placeholder: "64543543",
  },
  {
    id: "workflow",
    label: "Select a workflow",
    type: "select",
    initialValue: "pick",
    placeholder: "64543543",
    options: [
      {
        label: "Pick",
        value: "pick",
      },
      {
        label: "Ship",
        value: "ship",
      },
    ],
  },
];

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

  /*  function exportSubmissionsAsCSV() {
    let results = {
      workflow:
        schema.workflows[sessionConfig.productIndex].members[
          sessionConfig.workflowIndex
        ].name,
      product: schema.workflows[sessionConfig.productIndex].name,
      userName: sessionConfig.userName,
      referenceNumber: sessionConfig.referenceNumber,
      submissions: submissions.map((submission) => {
        return {
          ...submission,

          // replace the timestamp with an excel-compatible one
          timestamp: submission.timestamp.toLocaleString("en-US"),

          // add metadata to each record
          product: schema.workflows[sessionConfig.productIndex].name,
          workflow:
            schema.workflows[sessionConfig.productIndex].members[
              sessionConfig.workflowIndex
            ].name,
          userName: sessionConfig.userName,
          referenceNumber: sessionConfig.referenceNumber,
          qtyUnits: sessionConfig.qtyUnits,
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
  }*/

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            sessionConfig ? (
              <div className="shadow-xl p-4 rounded-lg m-4 ">
                <SchemaBasedForm
                  fields={sessionConfig.submissionFields}
                  submissionCallback={addSubmission}
                />
                <SubmissionHistoryView submissions={submissions} />
                <button
                  onClick={() => {
                    // TODO: reimplement results download
                    NiceModal.show(ConfirmModal, {
                      title: "Are you sure?",
                      message: `This will clear ${submissions.length} submissions and ${barcodes.length} barcodes, and reset the application to its original state. Make sure you've downloaded your work first.`,
                      action: "End job",
                      onAction: () => {
                        setBarcodes([]);
                        setSessionConfig(null);
                        setSubmissions([]);
                      },
                    });
                  }}
                  type="button"
                  className="inline-flex items-center mt-2 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon width={20} className="mr-1" />
                  End job
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-4 w-full md:w-1/2 shadow-lg m-4 rounded-lg">
                    <SchemaBasedForm
                      fields={setupFormFields}
                      submissionCallback={(values) => {
                        if (values.workflow === "pick") {
                          setSessionConfig({
                            ...WorkflowTemplate,
                            metadata: values,
                          });
                        } else {
                          // TODO: handle other workflow types
                          console.log("not implemented");
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )
          }
        />
      </Routes>
      <div className="flex justify-center items-end">
        <PrintModal
          id="print-modal"
          barcodes={barcodes}
          addBarcode={addBarcode}
          removeBarcode={removeBarcode}
          clearAllBarcodes={clearAllBarcodes}
          exportBarcodesAsCSV={""}
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
