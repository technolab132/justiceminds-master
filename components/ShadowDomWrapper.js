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
            padding: 10px; /* increased padding */
            white-space: pre-wrap;
            word-wrap: break-word;
            border-radius: 5px;
            max-width: 100%; /* ensure it fits within container */
            box-sizing: border-box; /* include padding in width calculation */
          }

          @media (max-width: 600px) {
            :host {
              padding: 5px; /* reduced padding for smaller screens */
            }
          }

          @media (min-width: 601px) and (max-width: 900px) {
            :host {
              padding: 8px; /* medium padding for tablets */
            }
          }

          @media (min-width: 901px) {
            :host {
              padding: 10px; /* larger padding for larger screens */
            }
          }

          /* Ensure htmlContent scales properly */
          .responsive-content {
            max-width: 100%;
            box-sizing: border-box;
            margin: 0 auto;
          }
        </style>
        <div class="responsive-content">
          ${htmlContent}
        </div>
      `;
    }
  }, [htmlContent]);

  return <div ref={shadowHostRef}></div>;
};

export default ShadowDomWrapper;
