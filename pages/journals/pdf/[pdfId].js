// // pages/journal/pdf/[pdfId].js
// import { useRouter } from 'next/router';
// import React, { useState, useEffect } from 'react';
// import HTMLFlipBook from 'react-pageflip';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const Pages = React.forwardRef((props, ref) => {
//   return (
//     <div className="demoPage" ref={ref}>
//       <p>{props.children}</p>
//       <p>Page number: {props.number}</p>
//     </div>
//   );
// });

// const PdfViewerJ = () => {
//   const router = useRouter();
//   const { pdfId } = router.query;
//   const [numPages, setNumPages] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   useEffect(() => {
//     async function fetchPdf() {
//       if (pdfId) {
//         try {
//           const { data, error } = await supabase.storage
//             .from('Documents')
//             .createSignedUrl(`${pdfId}`, 3600); // 3600 seconds = 1 hour
//             console.log(data);
//           if (error) {
//             throw error;
//           }
//           setPdfUrl(data.signedUrl);
//         } catch (error) {
//           console.error('Error fetching PDF:', error.message);
//         }
//       }
//     }

//     fetchPdf();
//   }, [pdfId]);

//   if (!pdfUrl) {
//     return <div className='p-10'>Loading PDF...</div>;
//   }

//   return (
//     <>
//       <div className="bg-black h-screen flex flex-col justify-end items-center md:justify-center scroll-mx-2 overflow-hidden">
//         <HTMLFlipBook width={350} height={500} showCover={true}>
//           {[...Array(numPages).keys()].map((n) => (
//             <Pages key={n} number={`${n + 1}`}>
//               <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
//                 <Page pageNumber={n + 1} renderAnnotationLayer={false} renderTextLayer={false} width={350} className="" />
//               </Document>
//             </Pages>
//           ))}
//         </HTMLFlipBook>
//       </div>
//     </>
//   );
// };

// export default PdfViewerJ;



import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});

const PdfViewerJ = () => {
  const router = useRouter();
  const { pdfId } = router.query;
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    async function fetchPdf() {
      if (pdfId) {
        try {
          const { data, error } = await supabase.storage
            .from('Documents')
            .createSignedUrl(`${pdfId}`, 3600); // 3600 seconds = 1 hour
            console.log(data);
          if (error) {
            throw error;
          }
          setPdfUrl(data.signedUrl);
        } catch (error) {
          console.error('Error fetching PDF:', error.message);
        }
      }
    }

    fetchPdf();
  }, [pdfId]);

  if (!pdfUrl) {
    return <div className='p-10'>Loading PDF...</div>;
  }

  return (
    <>
      <div className="bg-black h-screen flex flex-col justify-end items-center md:justify-center scroll-mx-2 overflow-hidden">
        <HTMLFlipBook width={600} height={800} showCover={true}>
          {[...Array(numPages).keys()].map((n) => (
            <Pages key={n} number={`${n + 1}`}>
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={n + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={600}
                  className="border-3 border-l border-black"
                />
              </Document>
            </Pages>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
};

export default PdfViewerJ;

