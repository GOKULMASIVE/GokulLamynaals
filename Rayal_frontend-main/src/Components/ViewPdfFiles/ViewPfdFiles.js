import React from "react";

const ViewPdfFiles = (props) => {
    const { pdfUrl } = props
    const pdfWindow = window.open("", "_blank");
    pdfWindow?.document?.write(
        `<embed src="data:application/pdf;base64,${pdfUrl}" width="100%" height="100%" />`
    );
}

export default ViewPdfFiles;