import React from "react";
import SchemaBasedForm from "../SchemaBasedForm";
import {downloadFile} from "../../App";
import Papa from "papaparse";

function PrintModalView(props) {
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
                            downloadFile( `${props.location}/${new Date().toISOString().replaceAll('/', '-').replaceAll(':', '-')}_barcodes.csv`, Papa.unparse(barcodes)).then(
                                (result) => {
                                    if(!result){
                                        alert("Something went wrong exporting barcodes.");
                                    }
                                });
                        }}
                        submitButtonText={"Print"}
                    />
                </div>
            </>
        );
    }

export default PrintModalView;
