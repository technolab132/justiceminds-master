// // components/EmailList.js

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const EmailList = () => {
//   const [emails, setEmails] = useState([]);

//   useEffect(() => {
//     async function fetchEmails() {
//       try {
//         const response = await axios.get('/api/gmail');
//         setEmails(response.data);
//       } catch (error) {
//         console.error(error);
//         // Handle error
//       }
//     }

//     fetchEmails();
//   }, []);

//   return (
//     <div>
//       <h2>Email List</h2>
//       <ul>
//         {emails.map((email, index) => (
//           <li key={index}>{email.snippet}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default EmailList;
import React from 'react'

const Emails = () => {
  return (
    <div>Emails</div>
  )
}

export default Emails
