
import React, {useState} from "react";

const FilterSidebar = ({ data,activeNameId, onSelectName }) => {

  const [searchTerm, setSearchTerm] = useState("");

  const uniqueNames = Array.from(new Set(data.map(item => item?.complaint_for)));

  const filteredNames = uniqueNames?.filter(name =>
    name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{display: "flex", flexDirection : "column", alignItems: "flex-start",padding:"10px", height: "100vh", overflowY: "auto", background:"black", width:"100%"}}>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px",
        width: "100%",
        background: "#000",
        marginBottom:"5px",
        border: "1px solid rgb(45,45,45)",
        position:"sticky",
        borderRadius:"5px",
        top:0}}
      />
      {filteredNames.map((item, index) => (
        <button
        className={`${activeNameId === item.id ? "bg-[#262626]" : "bg-[#0c0c0c] text-gray-400"}`}
          key={index}
          style={{
            padding: "12px 16px",
                  width: "100%",
                  marginBottom: "6px",
                  textAlign: "left",
                  wordBreak: "break-word",
                  borderRadius:"5px"
          }}
          onClick={() => {
            // Find the first item in the data array that matches the selected name
            const selectedItem = data.find(items => items.complaint_for === item);
            console.log(selectedItem);
            if (selectedItem) {
              onSelectName(selectedItem?.id);
            }
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterSidebar;