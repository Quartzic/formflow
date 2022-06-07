import React, { Component } from "react";
import { PrinterIcon, TrashIcon } from "@heroicons/react/solid";
import SchemaBasedForm from "../SchemaBasedForm";
import StyledButton from "../StyledButton";

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
        <SchemaBasedForm
          fields={[
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
          <StyledButton onClick={this.props.clearAllBarcodes} role="danger">
            <TrashIcon className="w-6 mr-2" />
            Clear
          </StyledButton>
          <StyledButton onClick={this.props.exportBarcodesAsCSV}>
            <PrinterIcon className="w-6 mr-2" />
            Print barcodes
          </StyledButton>
        </div>
      </>
    );
  }
}

export default PrintModalView;
