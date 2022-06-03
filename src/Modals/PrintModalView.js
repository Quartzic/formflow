import React, { Component } from "react";
import { PrinterIcon, TrashIcon } from "@heroicons/react/solid";
import WorkflowForm from "../WorkflowForm";

function BarcodeHistoryView(barcodes, removeBarcode) {
  return (
    <ul className="divide-y-2 mt-4">
      {barcodes.map((barcode, index) => (
        <li key={index} className="py-2">
          <p className="text-lg">
            {barcode}
            <button
              className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-1 rounded shadow-sm float-right"
              onClick={() => {
                removeBarcode(index);
              }}
            >
              <TrashIcon className="w-4" />
            </button>
          </p>
        </li>
      ))}
    </ul>
  );
}

class PrintModalView extends Component {
  render() {
    return (
      <>
        <WorkflowForm
          schema={[
            {
              id: "data",
              label: "Barcode Data",
              type: "text",
              initialValue: "",
              placeholder: "64543543",
            },
          ]}
          submissionCallback={(submission) => {
            this.props.addBarcode(submission.data);
          }}
        />

        {BarcodeHistoryView(this.props.barcodes, this.props.removeBarcode)}
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            className="mt-3 w-1/3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={this.props.clearAllBarcodes}
          >
            <TrashIcon className="w-6 mr-2" />
            Clear all
          </button>
          <button
            type="button"
            className="mt-3 w-2/3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={this.props.exportBarcodesAsCSV}
          >
            <PrinterIcon className="w-6 mr-2" />
            Print barcodes
          </button>
        </div>
      </>
    );
  }
}

export default PrintModalView;
