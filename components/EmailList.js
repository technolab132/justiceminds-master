import { useEffect, useState } from 'react';
import { fetchEmails } from '../lib/gmail'; // Adjust the path as needed

export default function EmailList() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    async function getEmails() {
      try {
        const messages = await fetchEmails();
        setEmails(messages);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
    getEmails();
  }, []);

  return (
    <div>
      <h1>Emails</h1>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.snippet}</li>
        ))}
      </ul>
    </div>
  );
}
