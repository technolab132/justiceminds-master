// import React from 'react';
// // import { SkeletonButton, SkeletonTextField, SkeletonParagraph, SkeletonDateField } from './Skeletons'; // Ensure this path is correct
// import { SkeletonCard ,SkeletonButton } from './ui/Skeletons';
// const Sidebar = ({ data, activeNameId, onSelectName, loading, hasMore, lastEmailRef }) => {
//   return (
//     <div
//       style={{
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         padding: "0px 2px 6px 6px",
//         height: "85%",
//         width: "100%",
//       }}
//       className="sidebar-container"
//     >
//       {loading ? (
//         Array.from({ length: 7 }).map((_, index) => (
//           <SkeletonButton key={index} />
//         ))
//       ) : (
//         data.map((item, index) => (
//           <button
//             className={`dark:hover:bg-[#1c1c1c] hover:bg-[#e6e6e6] ${
//               activeNameId?.email === item?.email
//                 ? "dark:bg-[#1c1c1c] bg-white"
//                 : "dark:bg-[#000000] bg-white text-gray-400"
//             }`}
//             key={index}
//             style={{
//               padding: "12px 16px",
//               width: "100%",
//               marginBottom: "6px",
//               textAlign: "left",
//               wordBreak: "break-word",
//               borderRadius: "5px",
//               fontSize: "14px",
//             }}
//             onClick={() => onSelectName(item)}
//           >
//             <strong
//               style={{ wordBreak: "break-word" }}
//               className="dark:text-[#d5d5d5] text-[#454545] text-[17px] text-pretty"
//             >
//               {item?.name}
//             </strong>
//             <br />
//             <p style={{ wordBreak: "break-word" }} className="text-pretty text-gray-500">{item?.email}</p>
//           </button>
//         ))
//       )}
//       <div
//         ref={lastEmailRef}
//         style={{
//           height: '50px', // Increased height
//           border: '1px solid transparent', // Added border to make it occupy space
//         }}
//       />
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import { SkeletonButton } from './ui/Skeletons';

const Sidebar = ({ data, activeNameId, onSelectName, loading, isLoadingMore, lastEmailRef }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px 2px 6px 6px",
        height: "85%",
        width: "100%",
        overflowY: "auto", // Ensure scrolling works
      }}
      className="sidebar-container"
    >
      {loading ? (
        Array.from({ length: 7 }).map((_, index) => (
          <SkeletonButton key={index} />
        ))
      ) : (
        <>
          {data.map((item, index) => (
            <button
              className={`dark:hover:bg-[#1c1c1c] hover:bg-[#e6e6e6] ${
                activeNameId?.email === item?.email
                  ? "dark:bg-[#1c1c1c] bg-white"
                  : "dark:bg-[#000000] bg-white text-gray-400"
              }`}
              key={index}
              style={{
                padding: "12px 16px",
                width: "100%",
                marginBottom: "6px",
                textAlign: "left",
                wordBreak: "break-word",
                borderRadius: "5px",
                fontSize: "14px",
              }}
              onClick={() => onSelectName(item)}
            >
              <strong
                style={{ wordBreak: "break-word" }}
                className="dark:text-[#d5d5d5] text-[#454545] text-[17px] text-pretty"
              >
                {item?.name}
              </strong>
              <br />
              <p style={{ wordBreak: "break-word" }} className="text-pretty text-gray-500">{item?.email}</p>
            </button>
          ))}
          {/* Loading more indicator */}
          {isLoadingMore && (
            Array.from({ length: 2 }).map((_, index) => (
              <SkeletonButton key={index} />
            ))
            // <div style={{ width: '100%', padding: '10px 0', textAlign: 'center' }}>
            //   <SkeletonButton />
            // </div>
          )}
          {/* The ref to trigger loading more data */}
          <div
            ref={lastEmailRef}
            style={{
              height: '50px',
              border: '1px solid transparent',
            }}
          />
        </>
      )}
    </div>
  );
};

export default Sidebar;

