// components/PdfViewer.js
import React from 'react';

const PDFViewer = ({ pdfLink, onClose, loading }) => {
  console.log(loading);
  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <button onClick={onClose}>Close</button>
      </div>
      {loading ? (
<p className='text-white p-10'>Loading . . . </p>
      ) : (
      <iframe src={pdfLink} title="PDF Viewer" className="pdf-iframe" />
      )}
    </div>
  );
};

export default PDFViewer;
