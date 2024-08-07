import Home from "./dashboard";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

const IndividualPage = () => {
  const router = useRouter();
  const { indi } = router.query;

  const [isClientExist, setIsClientExist] = useState(false);
  const [isLoading, setLoading] = useState(false); // Initialize loading as false
  const [clientData, setClientData] = useState();

  useEffect(() => {
    const checkClientExistence = async () => {
      try {
        const { data: clientData, error: clientError } = await supabase
          .from("Links")
          .select()
          .eq("email", indi);

        if (clientError) {
          throw clientError;
        }

        if (!clientData || clientData.length === 0) {
          setIsClientExist(false);
        } else {
          setIsClientExist(true);
          setClientData(clientData);
        }
      } catch (error) {
        console.error("Error checking client existence:", error.message);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    if (indi) {
      setLoading(true); // Set loading to true when there's a name in the URL
      checkClientExistence();
    } else {
      setLoading(false); // Set loading to false when there's no name in the URL
    }
  }, [indi]);

  if (isLoading) {
    // Still loading, show loading indicator
    return (
      <div className="p-5">
        <p className="text-white">
          <svg
            className={`${
              isLoading ? "animate-spin" : "hidden"
            } -ml-1 mr-3 h-5 w-5 text-white`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </p>
      </div>
    );
  }

  if (!isClientExist) {
    // Client not found, show "Not Found" message
    return <p className="text-white p-5">Not Found</p>;
  }

  return (
    <div className="overflow-auto h-[100vh]">
      <header className="text-gray-400 bg-[#131313] shadow-xl body-font mb-8">
        <div className="container mx-auto flex flex-row p-5 md:flex-row items-center">
        <div className="flex items-center gap-3">
                  <img
                    className="pt-1"
                    src="/smalllogo.png"
                    style={{ width: "60px" }}
                  />
                  <div className="">
                    <p className="text-lg ">Justiceminds</p>
                    <p className="text-xs">Data Driven Advocacy</p>
                  </div>
                  {/* <div className="">
                  <p className="text-lg ">Justiceminds</p>
                  <p className="text-xs">Data Driven Advocacy</p>
                </div> */}
                </div>
          {/* {indi} */}
        </div>
      </header>

      {clientData.map((data) => (
        <div className="container mx-auto bg-[#1d1d1d] p-8 mb-5">
          <h2 className="text-gray-400">
            <div
              dangerouslySetInnerHTML={{
                __html: `${data.link}`,
              }}
            ></div>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default IndividualPage;
