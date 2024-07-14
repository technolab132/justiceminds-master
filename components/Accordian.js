// components/Accordion.js
import Link from "next/link";
import { useState } from "react";

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* {items.map((item, index) => ( */}
      <div key={0} className="mb-2">
        <div
          className="flex items-center justify-between px-3 py-2 bg-[#1d1d1d] cursor-pointer"
          onClick={() => toggleAccordion(0)}
        >
          <div className="font-semibold">Options</div>
          <div>
            {openIndex === 0 ? (
              <svg
                className="w-5 h-5 transform rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            )}
          </div>
        </div>
        {openIndex === 0 && (
          <div className="px-3 py-2 flex flex-col  bg-[#1d1d1d] cursor-pointer">
            <Link
              href={"/incidents"}
              className=" text-white cursor-pointer m-3"
            >
              {`View Incidents  >`}
            </Link>
            <Link
              href={"/add-content"}
              className=" text-white cursor-pointer m-3"
            >
              {`Add Agency Data  >`}
            </Link>
            <Link href={"/agency"} className=" text-white cursor-pointer m-3">
              {`View All Agencies  >`}
            </Link>
            <Link href={"/add-chat-group"} className=" text-white cursor-pointer m-3">
              {`Add Chats  >`}
            </Link>
          </div>
        )}
      </div>
      {/* ))} */}
    </div>
  );
};

export default Accordion;
