// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const EmailList = ({ specificEmail }) => {
//   const [emails, setEmails] = useState([]);
//   const [nextPageToken, setNextPageToken] = useState(null);

//   const fetchEmails = async (pageToken = null) => {
//     try {
//       const response = await axios.get(`/api/emails?email=${specificEmail}&nextPageToken=${pageToken || ''}`);
//       const { emails: newEmails, nextPageToken: newNextPageToken } = response.data;

//       setEmails(prevEmails => [...prevEmails, ...newEmails]);
//       setNextPageToken(newNextPageToken);
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//     }
//   };

//   const handleLoadMore = () => {
//     fetchEmails(nextPageToken);
//   };

//   useEffect(() => {
//     fetchEmails();
//   }, [specificEmail]); // Fetch emails when specificEmail changes

//   return (
//     <div className='overflow-auto'>
//       <h1>Emails</h1>
//       <ul>
//         {emails.map(email => (
//           <li key={email.id}>
//             <div>Subject: {email.subject}</div>
//           </li>
//         ))}
//       </ul>
//       {nextPageToken && (
//         <button onClick={handleLoadMore}>Load More</button>
//       )}
//     </div>
//   );
// };

// export default EmailList;

import EmailList from '../components/EmailList';

export default function EmailsPage() {
  return (
    <div>
      <EmailList />
    </div>
  );
}

