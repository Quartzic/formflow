import React, { Component } from "react";
import { PrinterIcon, TrashIcon } from "@heroicons/react/solid";
import SchemaBasedForm from "../SchemaBasedForm";
import StyledButton from "../StyledButton";
import SubmissionHistoryView from "../SubmissionHistoryView";

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
            this.props.addBarcode(submission);
          }}
        />

        <SubmissionHistoryView
          submissions={this.props.barcodes}
          deleteSubmission={this.props.removeBarcode}
        />

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
