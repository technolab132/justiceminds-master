import React, { useRef, useEffect } from 'react';

const ShadowDomWrapper = ({ htmlContent }) => {
  const shadowRootRef = useRef(null);
  const shadowHostRef = useRef(null);

  useEffect(() => {
    if (shadowHostRef.current && !shadowRootRef.current) {
      shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'open' });
    }
    if (shadowRootRef.current) {
      shadowRootRef.current.innerHTML = `
        <style>
          :host {
            background-color: #ffffff; /* off-white background */
            display: block;
            padding: 5px; /* optional padding */
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
        ${htmlContent}
      `;
    }
  }, [htmlContent]);

  return <div ref={shadowHostRef}></div>;
};

export default ShadowDomWrapper;
