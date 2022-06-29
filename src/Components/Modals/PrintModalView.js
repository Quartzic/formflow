import React, {Component} from "react";
import SchemaBasedForm from "../SchemaBasedForm";
import {downloadCSV} from "../../App";
import Papa from "papaparse";

class PrintModalView extends Component {
    render() {
        return (
            <>
                <div className={"space-y-4"}>
                    <SchemaBasedForm
                        fields={[
                            {
                                id: "data",
                                label: "Barcode Data",
                                type: "text",
                                initialValue: "",
                            },
                            {
                                id: "copies",
                                label: "Copies",
                                type: "number",
                                initialValue: "1",
                            }
                        ]}
                        submissionCallback={(submission) => {
                            let barcodes = [
                                [
                                    submission.copies,
                                    submission.data
                                ],
                            ];
                            downloadCSV(Papa.unparse(barcodes), "barcodes");
                        }}
                    />
                </div>
            </>
        );
    }
}

export default PrintModalView;
