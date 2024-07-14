


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "@/components/LoadingComponent";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JournalsIndex = () => {
  const [isLoading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [imageurl, setImageUrl] = useState(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("*");
        if (booksError) {
          throw booksError;
        }
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleImageChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please select a file and provide a title.");
      return;
    }
    setUploading(true);
    try {
      const randomFileName = Math.random().toString(36).substr(2, 15);
      console.log("Upload path:", `/${randomFileName}`);
      const { data, error } = await supabase.storage
        .from("Documents")
        .upload(`/${randomFileName}`, file); // Upload with a random file name
      if (error) {
        throw error;
      }

      console.log(data);
      // Add a row to the books table
      const { data: newData, error: newError } = await supabase
        .from("books")
        .insert([{ title: title, key: data.path, bgimg:imageurl }]); // Use the key from storage as the value for the key column
      if (newError) {
        throw newError;
      }
      // setBooks([...books, newData[0]]);
      setTitle("");
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddNewJournal = async () => {
    try {
      // Display a confirmation dialog
      // const confirmed = window.confirm("Are you sure you want to add a new journal?");
      // if (!confirmed) {
      //   return; // If not confirmed, exit the function
      // }
  
      // Create a new book with a title and a blank page
      const { data, error } = await supabase.from("books").insert([
        { title: title, key: null, bgimg:imageurl }, // Assuming key will be updated after upload
      ]);
      if (error) {
        throw error;
      }
  
      // Refresh the books list
      // setBooks([...books, data[0]]);
      // window.location.reload()
      window.location.reload();
    } catch (error) {
      console.error("Error adding new journal:", error.message);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await supabase.from("books").delete().eq("id", id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting journal:", error.message);
    }
  };

  return (
    <div className="main hidden sm:flex overflow-auto justify-center items-center h-screen bg-[#111]">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="flex overflow-auto h-[90vh] w-full flex-col items-center">
          <Navbar />
          <div className="flex flex-row items-center gap-5 mt-[80px] mb-10">
            <div className="">
              <input className="bg-[#1d1d1d] border-2 border-[#262626] w-full px-4 py-2 text-white rounded-md"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Title"
              />
            </div>
            <div className="">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </div>
            <div className="">
              <input className="bg-[#1d1d1d] border-2 border-[#262626] w-full px-4 py-2 text-white rounded-md"
                type="text"
                value={imageurl}
                onChange={handleImageChange}
                placeholder="Insert Bg Image URL"
                // accept="application/pdf"
              />
            </div>
            <div className="">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-[#1c1c1c] text-white rounded-md"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <div>
              <button
                onClick={handleAddNewJournal}
                className="px-4 py-2 bg-[#1c1c1c] text-white rounded-md"
              >
                Add New Journal
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {books.map((book) => (
              <div key={book.id} className="m-4">
                {!book.key ? (
                  <Link href={`/journals/edit/${book.id}`}>
                    <div className="p-6 w-[180px] border-1 border border-[#f8f8f871] h-[200px] flex justify-center items-end bg-black text-gray-300 rounded-md overflow-hidden">
                      {book.title}
                    </div>
                  </Link>
                ) : (
                  <Link href={`/journals/pdf/${book.key}`}>
                    <div className="p-6 w-[180px] border-1 border border-[#f0e244a2] h-[200px] flex justify-center items-end bg-black text-gray-300 rounded-md overflow-hidden">
                      {book.title}
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(book.id)}
                  className="px-4 py-2 bg-[#1c1c1c] text-red-500 rounded-md my-3"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalsIndex;



// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { createClient } from "@supabase/supabase-js";
// import LoadingComponent from "@/components/LoadingComponent";
// import { useRouter } from "next/router";
// import Navbar from "@/components/Navbar";
// import { GridLayout, Grid } from 'react-grid-layout';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const JournalsIndex = () => {
//   const [isLoading, setLoading] = useState(false);
//   const [books, setBooks] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [title, setTitle] = useState("");
//   const router = useRouter();
//   const [file, setFile] = useState(null);
//   const [layout, setLayout] = useState({});

//   useEffect(() => {
//     async function fetchBooks() {
//       try {
//         setLoading(true);
//         const { data: booksData, error: booksError } = await supabase
//           .from("books")
//           .select("*");
//         if (booksError) {
//           throw booksError;
//         }
//         setBooks(booksData);
//       } catch (error) {
//         console.error("Error fetching books:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBooks();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleUpload = async () => {
//     if (!file || !title) {
//       alert("Please select a file and provide a title.");
//       return;
//     }
//     setUploading(true);
//     try {
//       const randomFileName = Math.random().toString(36).substr(2, 15);
//       console.log("Upload path:", `/${randomFileName}`);
//       const { data, error } = await supabase.storage
//         .from("Documents")
//         .upload(`/${randomFileName}`, file); // Upload with a random file name
//       if (error) {
//         throw error;
//       }

//       console.log(data);
//       // Add a row to the books table
//       const { data: newData, error: newError } = await supabase
//         .from("books")
//         .insert([{ title: title, key: data.path }]); // Use the key from storage as the value for the key column
//       if (newError) {
//         throw newError;
//       }
//       // setBooks([...books, newData[0]]);
//       setTitle("");
//       setFile(null);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error uploading file:", error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleAddNewJournal = async () => {
//     try {
//       // Create a new book with a title and a blank page
//       const { data, error } = await supabase.from("books").insert([
//         { title: "New Journal", key: null }, // Assuming key will be updated after upload
//       ]);
//       if (error) {
//         throw error;
//       }
//       // Refresh the books list
//       setBooks([...books, data[0]]);
//       window.location.reload()
//     } catch (error) {
//       console.error("Error adding new journal:", error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await supabase.from("books").delete().eq("id", id);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error deleting journal:", error.message);
//     }
//   };

//   const handleDragStart = (event) => {
//     // Set the dragged book
//     setLayout({ ...layout, [event.target.id]: { x: event.clientX, y: event.clientY } });
//   };

//   const handleDrop = (event) => {
//     console.log('Dropped!');
//     const newOrder = [...books];
//     newOrder.splice(event.index, 0, books.find(book => book.id === event.target.id));
//     setBooks(newOrder);
//   };

//   return (
//     <div className="main hidden sm:flex overflow-auto justify-center items-center h-screen bg-[#111]">
//       {isLoading ? (
//         <LoadingComponent />
//       ) : (
//         <div className="flex overflow-auto h-[90vh] w-full flex-col items-center">
//           <Navbar />
//           <div className="flex flex-row items-center gap-5 mt-[80px] mb-10">
//             <div className="">
//               <input className="bg-[#1d1d1d] border-2 border-[#262626] w-full px-4 py-2 text-white rounded-md"
//                 type="text"
//                 value={title}
//                 onChange={handleTitleChange}
//                 placeholder="Title"
//               />
//             </div>
//             <div className="">
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept="application/pdf"
//               />
//             </div>
//             <div className="">
//               <button
//                 onClick={handleUpload}
//                 className="px-4 py-2 bg-[#1c1c1c] text-white rounded-md"
//                 disabled={uploading}
//               >
//                 {uploading ? "Uploading..." : "Upload"}
//               </button>
//             </div>
//             <div>
//               <button
//                 onClick={handleAddNewJournal}
//                 className="px-4 py-2 bg-[#1c1c1c] text-white rounded-md"
//               >
//                 Add New Journal
//               </button>
//             </div>
//           </div>
//           <GridLayout className="grid-cols-4 gap-4" layout={layout} onDragStart={handleDragStart} onDrop={handleDrop}>
//             {books.map((book) => (
//               <Grid key={book.id} id={book.id} x={book.x} y={book.y} w={180} h={200}>
//                 <div className="p-6 w-[180px] border-1 border border-[#f8f8f871] h-[200px] flex justify-center items-end bg-black text-gray-300 rounded-md overflow-hidden">
//                   {book.title}
//                 </div>
//                 <button
//                   onClick={() => handleDelete(book.id)}
//                   className="px-4 py-2 bg-[#1c1c1c] text-white rounded-md"
//                 >
//                   Delete
//                 </button>
//               </Grid>
//             ))}
//           </GridLayout>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JournalsIndex;