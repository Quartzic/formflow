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
                                id: "labelCount",
                                label: "Label Count",
                                type: "number",
                                initialValue: "1",
                            }
                        ]}
                        submissionCallback={(submission) => {
                            let barcodes = [
                                [
                                    submission.labelCount,
                                    submission.data
                                ],
                            ];
                            downloadCSV(Papa.unparse(barcodes), "barcode");
                        }}
                    />
                </div>
            </>
        );
    }
}

export default PrintModalView;
