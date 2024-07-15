import React, { useEffect, useState } from "react";

const Sidebar = ({ data, activeNameId, onSelectName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // const filteredNames = data.filter((item) => {
  //   const headers = item.payload.headers;
  //   const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
  //   const from = fromHeader ? fromHeader.value : '';
  //   return from.toLowerCase().includes(searchTerm.toLowerCase());
  // }
  // );
  console.log('data',data);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div
      style={{
        position:"relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        // borderRight: "2px solid #424242",
        padding: "0px 2px 6px 6px",
        height: "100vh",
        overflowY: "auto",
        // background: "#0f0f0f",
        width: "100%",
      }}
      className="bg-[#f8f8f8] dark:bg-[#070707]"
    >
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          // background: "#000",
          marginTop:"15px",
          marginBottom:"5px",
          border: "1px solid #1c1c1c",
          position:"sticky",
          borderRadius:"5px",
          top:0
        }}
        className="bg-white dark:bg-black text-black dark:text-gray-600"
      />
      {loading ? (
        <p>Loading . . . </p>
      ) : (
        <div className="p-[4px]">
          {/* {filteredNames.map((item, index) => (
            <>
              <button
                className={`dark:hover:bg-[#1c1c1c] hover:bg-[#e6e6e6] ${
                  activeNameId === item.id
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
                  borderRadius:"5px",
                  fontSize:"14px"
                }}
                onClick={() => onSelectName(item.id)}
              >
                <strong style={{ wordBreak: "break-word" }} className="dark:text-[#d5d5d5] text-[#454545] text-[17px] text-pretty">{item.Name}</strong>
                <br />
                <p style={{ wordBreak: "break-word" }} className="text-pretty text-gray-500">{item.Email}</p>
              </button>
            </>
          ))} */}
          {data.map((item, index) => {
            // Safely extract the name from the "from" field
            // let name = "Unknown";
            // let email = "Unknown";
            // const headers = item.payload.headers;
            // const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
            // if (fromHeader) {
            //   const fromParts = fromHeader.value.split('<');
            //   name = fromParts[0].trim();
            //   if(fromParts.length > 1){
            //     email = fromParts[1];
            //   }
              
            // }
            return (
              <button
                className={`dark:hover:bg-[#1c1c1c] hover:bg-[#e6e6e6] ${
                  activeNameId === item.id
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
                  {item.name}
                </strong>
                <br />
                <p style={{ wordBreak: "break-word" }} className="text-pretty text-gray-500">{item.email}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
