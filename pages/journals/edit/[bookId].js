// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/router';
// import { createClient } from "@supabase/supabase-js";
// import LoadingComponent from "@/components/LoadingComponent";
// import dynamic from "next/dynamic";
// import Login from "@/components/Login";
// import { setCookie } from "nookies";
// import { parse } from "cookie";
// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const EditBook = () => {
//   const router = useRouter();
//   const editor = useRef(null);
//   const { bookId } = router.query;
//   const [isLoading, setLoading] = useState(false);
//   const [bookData, setBookData] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [pendingChanges, setPendingChanges] = useState({});

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       toolbarButtonSize: "small",
//       autofocus: false,
//       readonly: false,
//       theme: "dark",
//       statusbar: false,
//       minHeight: "100px"
//     }),
//     []
//   );
//   async function fetchBookData() {
//     try {
//       setLoading(true);
//       const { data: bookData, error: bookError } = await supabase
//         .from('books')
//         .select('*')
//         .eq('id', bookId)
//         .single();
//       if (bookError) {
//         throw bookError;
//       }

//       const { data: pagesData, error: pagesError } = await supabase
//         .from('pages')
//         .select('*')
//         .eq('bookId', bookId);
//       if (pagesError) {
//         throw pagesError;
//       }

//       // Combine the original book content and the fetched pages
//       const combinedPages = [...pagesData];

//       setBookData({ ...bookData, pages: combinedPages });
//     } catch (error) {
//       console.error('Error fetching book data:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
    
  
//     fetchBookData();
//   }, [bookId]);
  

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parse(document.cookie);
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//   }, []);

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   const handlePageContentChange = (pageId, content) => {
//     setPendingChanges({ ...pendingChanges, [pageId]: content });
//   };

//   const saveChanges = async () => {
//     try {
//       setLoading(true);
//       const pageUpdates = Object.entries(pendingChanges).map(([pageId, content]) => (
//         supabase
//           .from('pages')
//           .update({ pagecontent: content })
//           .eq('id', pageId)
//       ));
//       await Promise.all(pageUpdates);
//       console.log('Changes saved successfully');
      
//       // Update the book data with the latest pages data
//       await fetchBookData();
//     } catch (error) {
//       console.error('Error saving changes:', error.message);
//     } finally {
//       setLoading(false);
//       setPendingChanges({});
//     }
//   };
  
  

//   const addPage = async () => {
//     try {
//       setLoading(true);
//       // Calculate the next page number
//       const nextPageNumber = bookData.pages.length + 1;
  
//       const { data, error } = await supabase
//         .from('pages')
//         .insert([{ bookId, pagecontent: '', pageNo: nextPageNumber }]);
//       if (error) {
//         throw error;
//       }
//       console.log('Page added:', data);
      
//       // Update the book data with the latest pages data
//       await fetchBookData();
//     } catch (error) {
//       console.error('Error adding page:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="main hidden overflow-auto sm:flex justify-center items-center h-screen bg-[#1d1d1d]">
//       {isLoading ? (
//         <LoadingComponent />
//       ) : bookData ? (
//         <div className="container overflow-auto mx-auto p-6 h-[100vh]">
//           {/* <h1 className="text-3xl font-semibold mb-4">{bookData.title}</h1> */}
//           {bookData.pages.map((page, index) => (
//             <div key={index} className="mb-8">
//               <h2 className="text-xl font-semibold mb-2">Page {index + 1}</h2>
//               <JoditEditor
//                 ref={editor}
//                 value={page.pagecontent}
//                 config={config}
//                 onChange={(content) => handlePageContentChange(page.id, content)}
//               />
//             </div>
//           ))}
//           <button
//             onClick={addPage}
//             className="text-white px-4 py-2 bg-[#1d1d1d] rounded-md"
//           >
//             Add Page
//           </button>
//           <button onClick={saveChanges}>Save Changes</button>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <p className="text-white">Book not found.</p>
//       )}
//     </div>
//   );
// }

// export default EditBook;



// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/router';
// import { createClient } from "@supabase/supabase-js";
// import LoadingComponent from "@/components/LoadingComponent";
// import dynamic from "next/dynamic";
// import Login from "@/components/Login";
// import { setCookie } from "nookies";
// import { parse } from "cookie";
// const JoditEditor = dynamic(() => import("jodit-react"), {
//   ssr: false,
// });
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const EditBook = () => {
//   const router = useRouter();
//   const editor = useRef(null);
//   const { bookId } = router.query;
//   const [isLoading, setLoading] = useState(false);
//   const [bookData, setBookData] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [pendingChanges, setPendingChanges] = useState({});

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       toolbarButtonSize: "small",
//       autofocus: false,
//       readonly: false,
//       theme: "dark",
//       statusbar: false,
//       minHeight: "500px"
//     }),
//     []
//   );

//   async function fetchBookData() {
//     try {
//       setLoading(true);
//       const { data: bookData, error: bookError } = await supabase
//         .from('books')
//         .select('*')
//         .eq('id', bookId)
//         .single();
//       if (bookError) {
//         throw bookError;
//       }

//       const { data: pagesData, error: pagesError } = await supabase
//         .from('pages')
//         .select('*')
//         .eq('bookId', bookId)
//         .order('pageNo', { ascending: true });
//       if (pagesError) {
//         throw pagesError;
//       }

//       // Combine the original book content and the fetched pages
//       const combinedPages = [...pagesData];

//       setBookData({ ...bookData, pages: combinedPages });
//     } catch (error) {
//       console.error('Error fetching book data:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   }
  
//   useEffect(() => {
//     fetchBookData();
//   }, [bookId]);

//   useEffect(() => {
//     // Parse the cookie after the page is mounted
//     const cookies = parse(document.cookie);
//     setIsLoggedIn(cookies.isLoggedIn === "true");
//   }, []);

//   const handleLogout = () => {
//     // Set the "isLoggedIn" cookie to expire immediately
//     setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
//     setIsLoggedIn(false);
//   };

//   const handlePageContentChange = (pageId, content) => {
//     setPendingChanges({ ...pendingChanges, [pageId]: content });
//   };

//   const saveChanges = async () => {
//     try {
//       setLoading(true);
//       const pageUpdates = Object.entries(pendingChanges).map(([pageId, content]) => (
//         supabase
//           .from('pages')
//           .update({ pagecontent: content })
//           .eq('id', pageId)
//       ));
//       await Promise.all(pageUpdates);
//       console.log('Changes saved successfully');
      
//       // Update the book data with the latest pages data
//       await fetchBookData();
//     } catch (error) {
//       console.error('Error saving changes:', error.message);
//     } finally {
//       setLoading(false);
//       setPendingChanges({});
//     }
//   };
  
//   const addPage = async () => {
//     try {
//       setLoading(true);
//       // Calculate the next page number
//       const nextPageNumber = bookData.pages.length + 1;
  
//       const { data, error } = await supabase
//         .from('pages')
//         .insert([{ bookId, pagecontent: '', pageNo: nextPageNumber }]);
//       if (error) {
//         throw error;
//       }
//       console.log('Page added:', data);
      
//       // Update the book data with the latest pages data
//       await fetchBookData();
//     } catch (error) {
//       console.error('Error adding page:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const deletePage = async (pageId, pageNo) => {
//     try {
//       setLoading(true);
//       // Delete the page
//       await supabase
//         .from('pages')
//         .delete()
//         .eq('id', pageId);
      
//       // Update page numbers for remaining pages
//       const remainingPages = bookData.pages.filter(page => page.id !== pageId);
//       for (let i = 0; i < remainingPages.length; i++) {
//         if (remainingPages[i].pageNo > pageNo) {
//           await supabase
//             .from('pages')
//             .update({ pageNo: remainingPages[i].pageNo - 1 })
//             .eq('id', remainingPages[i].id);
//         }
//       }
      
//       // Update the book data with the latest pages data
//       await fetchBookData();
//     } catch (error) {
//       console.error('Error deleting page:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="main hidden overflow-auto sm:flex justify-center items-center h-screen bg-[#1d1d1d]">
//       {isLoggedIn ? (
//         isLoading ? (
//           <LoadingComponent />
//         ) : bookData ? (
//           <div className="container overflow-auto mx-auto p-6 h-[100vh]">
//             <a className='text-lg p-3 bg-black' href={`/journals/${bookId}`}>View page</a>
//             {bookData.pages.map((page, index) => (
//               <div key={index} className="mb-8 mt-6">
//                 <h2 className="text-xl font-semibold mb-2">Page {page.pageNo}</h2>
//                 <JoditEditor
//                   ref={editor}
//                   value={page.pagecontent}
//                   config={config}
//                   onChange={(content) => handlePageContentChange(page.id, content)}
//                 />
//                 <button className='text-red-500 p-6' onClick={() => deletePage(page.id, page.pageNo)}>Delete Page</button>
//               </div>
//             ))}
//             <button
//               onClick={addPage}
//               className="text-white px-4 py-2 bg-[#1d1d1d] rounded-md"
//             >
//               Add Page
//             </button>
//             <button onClick={saveChanges}>Save Changes</button>
//             {/* <button onClick={handleLogout}>Logout</button> */}
//           </div>
//         ) : (
//           <p className="text-white">Book not found.</p>
//         )
//       ) : (
//         <Login />
//       )}
//     </div>
//   );
// }

// export default EditBook;






import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "../../../components/LoadingComponent";
import dynamic from "next/dynamic";
import Login from "../../../components/Login";
import { setCookie } from "nookies";
import { parse } from "cookie";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const EditBook = () => {
  const router = useRouter();
  const editor = useRef(null);
  const { bookId } = router.query;
  const [isLoading, setLoading] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [imageUrl, setImageUrl] = useState(""); // State for storing the image URL

  const config = useMemo(
    () => ({
      readonly: false,
      toolbarButtonSize: "small",
      autofocus: false,
      readonly: false,
      theme: "dark",
      statusbar: false,
      minHeight: "500px"
    }),
    []
  );

  async function fetchBookData() {
    try {
      setLoading(true);
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
      if (bookError) {
        throw bookError;
      }

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('bookId', bookId)
        .order('pageNo', { ascending: true });
      if (pagesError) {
        throw pagesError;
      }

      // Combine the original book content and the fetched pages
      const combinedPages = [...pagesData];

      setBookData({ ...bookData, pages: combinedPages });
    } catch (error) {
      console.error('Error fetching book data:', error.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchBookData();
    async function fetchImageUrl() {
      try {
        setLoading(true);
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('bgimg')
          .eq('id', bookId)
          .single();
        if (bookError) {
          throw bookError;
        }
        // Set the image URL state
        setImageUrl(bookData.bgimg || "");
      } catch (error) {
        console.error('Error fetching image URL:', error.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchImageUrl();
  }, [bookId]);

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const handlePageContentChange = (pageId, content) => {
    setPendingChanges({ ...pendingChanges, [pageId]: content });
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const pageUpdates = Object.entries(pendingChanges).map(([pageId, content]) => (
        supabase
          .from('pages')
          .update({ pagecontent: content })
          .eq('id', pageId)
      ));
      await Promise.all(pageUpdates);
      console.log('Changes saved successfully');
      
      // Update the book data with the latest pages data
      await fetchBookData();

      // Update the book data with the image URL
      await supabase
        .from('books')
        .update({ bgimg: imageUrl })
        .eq('id', bookId);
    } catch (error) {
      console.error('Error saving changes:', error.message);
    } finally {
      setLoading(false);
      setPendingChanges({});
      // setImageUrl(""); // Clear the image URL after saving changes

    }
  };
  
  const addPage = async () => {
    try {
      setLoading(true);
      // Calculate the next page number
      const nextPageNumber = bookData.pages.length + 1;
  
      const { data, error } = await supabase
        .from('pages')
        .insert([{ bookId, pagecontent: '', pageNo: nextPageNumber }]);
      if (error) {
        throw error;
      }
      console.log('Page added:', data);
      
      // Update the book data with the latest pages data
      await fetchBookData();
    } catch (error) {
      console.error('Error adding page:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deletePage = async (pageId, pageNo) => {
    try {
      setLoading(true);
      // Delete the page
      await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);
      
      // Update page numbers for remaining pages
      const remainingPages = bookData.pages.filter(page => page.id !== pageId);
      for (let i = 0; i < remainingPages.length; i++) {
        if (remainingPages[i].pageNo > pageNo) {
          await supabase
            .from('pages')
            .update({ pageNo: remainingPages[i].pageNo - 1 })
            .eq('id', remainingPages[i].id);
        }
      }
      
      // Update the book data with the latest pages data
      await fetchBookData();
    } catch (error) {
      console.error('Error deleting page:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main hidden overflow-auto sm:flex justify-center items-center h-screen bg-[#1d1d1d]">
      {isLoggedIn ? (
        isLoading ? (
          <LoadingComponent />
        ) : bookData ? (
          <div className="container overflow-auto mx-auto p-6 h-[100vh]">
            {/* Add input field for entering image URL */}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter Image URL"
              className="bg-[#1d1d1d] border-2 border-[#262626] mr-4 px-4 py-2 text-white rounded-md"
            />
            {/* Display page content */}
            <a className='text-lg p-3 bg-black' href={`/journals/${bookId}`}>View page</a>
            {bookData.pages.map((page, index) => (
              <div key={index} className="mb-8 mt-6">
                <h2 className="text-xl font-semibold mb-2">Page {page.pageNo}</h2>
                <JoditEditor
                  ref={editor}
                  value={page.pagecontent}
                  config={config}
                  onChange={(content) =>  handlePageContentChange(page.id, content)}
                  />
                  <button className='text-red-500 p-6' onClick={() => deletePage(page.id, page.pageNo)}>Delete Page</button>
                </div>
              ))}
              {/* Add button to save changes */}
              <button onClick={addPage} className="text-white px-4 py-2 bg-[#1d1d1d] rounded-md">Add Page</button>
              <button onClick={saveChanges}>Save Changes</button>
              {/* <button onClick={handleLogout}>Logout</button> */}
            </div>
          ) : (
            <p className="text-white">Book not found.</p>
          )
        ) : (
          <Login />
        )}
      </div>
    );
  }
  
  export default EditBook;
  