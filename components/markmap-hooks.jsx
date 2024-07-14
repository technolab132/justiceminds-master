
// import React, { useState, useRef, useEffect } from "react";
// import { Transformer } from "markmap-lib";
// import { Markmap } from "markmap-view";
// import { Toolbar } from "markmap-toolbar";
// import "markmap-toolbar/dist/style.css";
// import { toPng } from "html-to-image";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";

// const transformer = new Transformer();
// const initValue = "";

// function renderToolbar(mm, wrapper) {
//   while (wrapper?.firstChild) wrapper.firstChild.remove();
//   if (mm && wrapper) {
//     const toolbar = new Toolbar();
//     toolbar.attach(mm);
//     toolbar.register({
//       id: "alert",
//       title: "Click to show an alert",
//       content: "Alert",
//       onClick: () => alert("You made it!"),
//     });
//     toolbar.setItems([...Toolbar.defaultItems, "alert"]);
//     wrapper.append(toolbar.render());
//   }
// }

// export default function MarkmapHooks() {
//   const [value, setValue] = useState("");
//   const refSvg = useRef();
//   const refMm = useRef();
//   const refToolbar = useRef();

//   useEffect(() => {
//     // Load the saved value from local storage on page reload
//     const savedValue = localStorage.getItem("savedValue");
//     if (savedValue) {
//       setValue(savedValue);
//     }

//     const mm = Markmap.create(refSvg.current);
//     refMm.current = mm;
//     renderToolbar(refMm.current, refToolbar.current);
//   }, []);

//   useEffect(() => {
//     // Save the current value to local storage
//     localStorage.setItem("savedValue", value);

//     const mm = refMm.current;
//     if (!mm || !value.trim()) {
//       return;
//     }

//     const { root } = transformer.transform(value);
//     mm.setData(root);
//     mm.fit();
//   }, [value]);

//   const handleChange = (e) => {
//     setValue(e.target.value);
//   };

//   const handleSave = () => {
//     // Save the current value to local storage
//     localStorage.setItem("savedValue", value);
//   };

//   const handleGenerateImage = () => {
//     const svgElement = refSvg?.current;

//     // Use html-to-image library to convert SVG to PNG image
//     toPng(svgElement)
//       .then(function (dataUrl) {
//         // Create a virtual link and trigger a click to download the image
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.target = "_blank"; // Open in a new tab
//         link.download = "markmap.png";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch(function (error) {
//         console.error("Error generating image:", error);
//       });
//   };

//   return (
//     <ResizablePanelGroup direction="horizontal" className="pt-[75px] dark">
//       <ResizablePanel defaultSize={25}>
//         <div className="min-w-[400px] max-w-[600px] h-[100%] p-6">
//           <p className="mb-4">Insert Content for Mapping</p>
//           <textarea placeholder="Write something"
//             className="w-full h-[50%] p-4 rounded-lg bg-[#1c1c1c]"
//             value={value}
//             onChange={handleChange}
//           />
//           {/* <button
//             className="text-white px-4 py-2 cursor-pointer bg-[#1d1d1d] rounded-lg mt-4"
//             onClick={handleSave}
//           >
//             Save
//           </button> */}
//         </div>
//       </ResizablePanel>
//       <ResizableHandle withHandle />
//       <ResizablePanel defaultSize={75}>
//         <div className="relative p-4 m-4 border rounded-lg border-[#1d1d1d] w-[95%] h-[80vh]">
//           <svg className="flex-1 w-full h-full" ref={refSvg} />
//           {/* <div className="absolute bottom-1 right-1" ref={refToolbar}></div> */}
//           {value ? (
//             <button
//             className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] rounded-lg absolute bottom-4"
//             onClick={handleGenerateImage}
//           >
//             Generate Image
//           </button>
//           ) : (
//             <button
//             className="cursor-not-allowed text-gray-600 px-8 py-2 bg-[#1d1d1d] rounded-lg absolute bottom-4"
//             disabled
//           >
//             Generate Image
//           </button>
//           )}
          
//         </div>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";
import { toPng } from "html-to-image";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

const transformer = new Transformer();
const initValue = "";

function renderToolbar(mm, wrapper) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    toolbar.register({
      id: "alert",
      title: "Click to show an alert",
      content: "Alert",
      onClick: () => alert("You made it!"),
    });
    toolbar.setItems([...Toolbar.defaultItems, "alert"]);
    wrapper.append(toolbar.render());
  }
}

export default function MarkmapHooks() {
  const [value, setValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const refSvg = useRef();
  const refMm = useRef();
  const refToolbar = useRef();
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Load the saved value from local storage on page reload
    const savedValue = localStorage.getItem("savedValue");
    if (savedValue) {
      setValue(savedValue);
    }

    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    renderToolbar(refMm.current, refToolbar.current);
  }, []);

  useEffect(() => {
    // Save the current value to local storage
    localStorage.setItem("savedValue", value);

    const mm = refMm.current;
    if (!mm || !value.trim()) {
      return;
    }

    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit();
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSave = () => {
    // Save the current value to local storage
    localStorage.setItem("savedValue", value);
  };

  const handleGenerateImage = () => {
    const svgElement = refSvg?.current;

    // Use html-to-image library to convert SVG to PNG image
    toPng(svgElement)
      .then(function (dataUrl) {
        // Create a virtual link and trigger a click to download the image
        const link = document.createElement("a");
        link.href = dataUrl;
        link.target = "_blank"; // Open in a new tab
        link.download = "markmap.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.error("Error generating image:", error);
      });
  };

  const toggleSpeech = () => {
    if (!isSpeaking) {
      const speechText = new SpeechSynthesisUtterance(value);
      speechText.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
  
      // Customize voice here
      const voices = window.speechSynthesis.getVoices();
      // Choose the desired voice by its index or other criteria
      console.log(voices);
      const selectedVoice = voices.find((voice) => voice.name === "Daniel (English (United Kingdom))");
      if (selectedVoice) {
        speechText.voice = selectedVoice;
      }
  
      utteranceRef.current = speechText;
      window.speechSynthesis.speak(speechText);
    } else {
      setIsSpeaking(false);
      window.speechSynthesis.cancel();
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="pt-[75px] dark">
      <ResizablePanel defaultSize={25}>
        <div className="min-w-[400px] max-w-[600px] h-[100%] p-6">
          <p className="mb-4">Insert Content for Mapping</p>
          <textarea
            placeholder="Write something"
            className="w-full h-[50%] p-4 rounded-lg bg-[#1c1c1c]"
            value={value}
            onChange={handleChange}
          />
          <button
            className={`${
              isSpeaking ? "bg-[#000]" : "bg-[#1f1f1f]"
            } text-white px-8 py-2 cursor-pointer rounded-lg mt-5`}
            onClick={toggleSpeech}
          >
            {isSpeaking ? "Stop Speaking" : "Start Speaking"}
          </button>
          {/* <button
            className="text-white px-4 py-2 cursor-pointer bg-[#1d1d1d] rounded-lg mt-4"
            onClick={handleSave}
          >
            Save
          </button> */}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="relative p-4 m-4 border rounded-lg border-[#1d1d1d] w-[95%] h-[80vh]">
          <svg className="flex-1 w-full h-full" ref={refSvg} />
          {/* <div className="absolute bottom-1 right-1" ref={refToolbar}></div> */}
          
          <button
            className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] rounded-lg absolute bottom-4 right-20"
            onClick={handleGenerateImage}
          >
            Generate Image
          </button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}



// import React, { useState, useRef, useEffect } from 'react';
// import { Transformer } from 'markmap-lib';
// import { Markmap } from 'markmap-view';
// import { Toolbar } from 'markmap-toolbar';
// import 'markmap-toolbar/dist/style.css';
// import { toPng } from 'html-to-image';
// import { useRouter } from 'next/router';

// const transformer = new Transformer();
// const initValue = '';

// function renderToolbar(mm, wrapper) {
//   while (wrapper?.firstChild) wrapper.firstChild.remove();
//   if (mm && wrapper) {
//     const toolbar = new Toolbar();
//     toolbar.attach(mm);
//     toolbar.register({
//       id: 'alert',
//       title: 'Click to show an alert',
//       content: 'Alert',
//       onClick: () => alert('You made it!'),
//     });
//     toolbar.setItems([...Toolbar.defaultItems, 'alert']);
//     wrapper.append(toolbar.render());
//   }
// }

// const MarkmapHooks = () => {
//   const [value, setValue] = useState('');
//   const refSvg = useRef();
//   const refMm = useRef();
//   const refToolbar = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     const mm = Markmap.create(refSvg.current);
//     refMm.current = mm;
//     renderToolbar(refMm.current, refToolbar.current);
//   }, []);

//   useEffect(() => {
//     const mm = refMm.current;
//     if (!mm || !value.trim()) {
//       return;
//     }

//     const { root } = transformer.transform(value);
//     mm.setData(root);
//     mm.fit();
//   }, [value]);

//   const handleChange = (e) => {
//     setValue(e.target.value);
//   };

//   const handleGenerateImage = () => {
//     const svgElement = refSvg?.current;

//     toPng(svgElement)
//       .then((dataUrl) => {
//         const link = document.createElement('a');
//         link.href = dataUrl;
//         link.target = '_blank';
//         link.download = 'markmap.png';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch((error) => {
//         console.error('Error generating image:', error);
//       });
//   };

//   const handleCreateLink = () => {
//     // Create a link with the current content value
//     const encodedValue = encodeURIComponent(value);
//     router.push(`/maps/${encodedValue}`);
//   };

//   return (
//     <div className="flex flex-row gap-3 pt-[80px] h-screen w-full">
//       <div className="min-w-[400px] h-[100%] p-6">
//         <p className="mb-4">Insert Content for Mapping</p>
//         <textarea
//           className="w-full h-[50%] p-4 rounded-lg bg-[#1c1c1c]"
//           value={value}
//           onChange={handleChange}
//         />
//         <button
//           className="mt-4 bg-[#1d1d1d] text-white px-4 py-2 rounded-lg"
//           onClick={handleCreateLink}
//         >
//           Create Link
//         </button>
//       </div>
//       <div className="relative p-4 w-full h-[85vh]">
//         <svg className="flex-1 w-full h-full" ref={refSvg} />
//         <button
//           className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d] rounded-lg absolute bottom-1"
//           onClick={handleGenerateImage}
//         >
//           Generate Image
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MarkmapHooks;

