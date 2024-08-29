import React, { useEffect, useState } from "react";
import DetailPanel from '../../components/DetailsPanel';
import { useRouter } from 'next/router';

// Import the decryption function to decrypt the token
import { decryptToken } from '../../lib/tokenUtils';

export default function SharedPage() {
  const router = useRouter();
  const { token } = router.query;
  const { emailId } = router.query;
  const { name } = router.query
  const { refreshToken } = router.query
  // refreshToken=${refreshToken}&emailId=${Email}&name=${Name
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('token',token);
  console.log('emailId',router.query);
  const [sentEmails, setSentEmails] = useState([]);
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [sentEmailCount, setSentEmailCount] = useState(0);
  const [receivedEmailCount, setReceivedEmailCount] = useState(0);
  const [incident, setIncident] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState({});
  const [extractedUrls, setExtractedUrls] = useState({});
  const [loadingtext, setLoadingText] = useState(false);
  // Initialize state for current page and total pages
  const [currentPage, setCurrentPage] = useState({ sent: 1, received: 1 });
  const [emailsPerPage] = useState(50); // Display 50 emails per page
  const [nextPageTokens, setNextPageTokens] = useState({
    sent: null,
    received: null,
  });
  const [currentlyExtractingEmailIndex, setCurrentlyExtractingEmailIndex] =
    useState(-1);
  useEffect(() => {
    if (token) {
      async function fetchData() {
        const data = {
          Email: emailId,
          Name: name,
          accessToken: token,
          refreshToken: refreshToken
        }
        setSelectedData(data);
        console.log('selectedData',selectedData);
        try {
          // Fetch the first 1000 emails for both SENT and RECEIVED
          const Sentresponse = await fetch(`/api/filter-emails?label=SENT&type=SENT&maxResults=10&token=${token}&emailId=${emailId}&refreshToken=${refreshToken}`);
          const { emails: SentEmails, nextPageToken: sentNextPageToken} = await Sentresponse.json();
      
          if (Sentresponse.ok) {
            setSentEmails(SentEmails);
          } else {
            setError(SentEmails.error);
          }
      
          const Receivedresponse = await fetch(`/api/filter-emails?label=INBOX&type=RECIEVE&maxResults=10&token=${token}&emailId=${emailId}&refreshToken=${refreshToken}`);
          const { emails: receivedEmails } = await Receivedresponse.json();
      
          if (Receivedresponse.ok) {
            setReceivedEmails(receivedEmails);
          } else {
            setError(receivedEmails.error);
          }
      
          // Fetch count of sent and received emails
          const sentCountResponse = await fetch(`/api/fetch-email-count?&type=SENT&token=${token}&emailId=${emailId}&refreshToken=${refreshToken}`);
          const sentData = await sentCountResponse.json();
      
          if (sentCountResponse.ok) {
            setSentEmailCount(sentData.count);
          } else {
            setError(sentData.error);
          }
      
          const receivedCountResponse = await fetch(`/api/fetch-email-count?&type=RECIEVE&token=${token}&emailId=${emailId}&refreshToken=${refreshToken}`);
          const receivedData = await receivedCountResponse.json();
      
          if (receivedCountResponse.ok) {
            setReceivedEmailCount(receivedData.count);
          } else {
            setError(receivedData.error);
          }
      
        } catch (err) {
          console.error('Error fetching emails:', err);
          //setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [token]);

  const paginatedSentEmails = sentEmails.slice(
    (currentPage.sent - 1) * emailsPerPage,
    currentPage.sent * emailsPerPage
  );
  
  const paginatedReceivedEmails = receivedEmails.slice(
    (currentPage.received - 1) * emailsPerPage,
    currentPage.received * emailsPerPage
  );
  
  // Updated handlePageChange
  const handlePageChange = async (type, direction) => {
    setCurrentPage((prev) => {
      const newPage = direction === "next" ? prev[type] + 1 : prev[type] - 1;

      // If moving to the next page and need more emails
      if (direction === "next" && newPage * emailsPerPage > (type === 'sent' ? sentEmails.length : receivedEmails.length)) {
        fetchMoreEmails(type.toUpperCase());
      }

      return { ...prev, [type]: newPage };
    });
  };

  // Adjusted fetchMoreEmails
  const fetchMoreEmails = async (type) => {
    const nextPageToken = nextPageTokens[type.toLowerCase()];
    if (!nextPageToken) return;

    try {
      const response = await fetch(`/api/filter-emails?sender=${selectedName.Email}&type=${type}&pageToken=${nextPageToken}`);
      const { emails, nextPageToken: newNextPageToken } = await response.json();

      if (response.ok) {
        if (type === 'SENT') {
          setSentEmails((prev) => [...prev, ...emails]);
          setNextPageTokens((prev) => ({ ...prev, sent: newNextPageToken }));
        } else {
          setReceivedEmails((prev) => [...prev, ...emails]);
          setNextPageTokens((prev) => ({ ...prev, received: newNextPageToken }));
        }
      } else {
        setError(emails.error);
      }
    } catch (err) {
      console.error('Error fetching more emails:', err);
      setError(err.message);
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="fixed top-0 z-[1000] w-full bg-[#0f0f0f] flex py-3 flex-row justify-between items-center ">
        <div className="flex items-center gap-3 ml-10">
          <img
            className="pt-1"
            src="/smalllogo.png"
            style={{ width: "60px" }}
          />
          <div className="">
            <p className="text-md sm:text-lg ">Justiceminds</p>
            <p className="text-xs sm:text-xs">Data Driven Advocacy</p>
          </div>
        </div>
        <div className="items mr-10">
          <ul className="flex gap-6">
            <li>
              <a
                className={`hover:underline sm:text-md text-xs`}
                href="mailto:advocacy@justice-minds.com"
              >
                advocacy@justice-minds.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex h-screen overflow-hidden pt-[60px] lg:pt-[80px]">
        <div className="overflow-y-auto w-full md:w-2/3 md:m-6 rounded-lg bg-[#101010] md:mx-auto">
          {/* Render DetailPanel with the email data */}
          {/* {emailData ? ( */}
            <DetailPanel
              selectedData={selectedData}
              sentEmails={paginatedSentEmails}
              receivedEmails={paginatedReceivedEmails}
              sentEmailCount={sentEmailCount}
              receivedEmailCount={receivedEmailCount}
              onClose={() => {}}
              //messages={messages}
              loading={loading}
              extractedTexts={extractedTexts}
              setExtractedTexts={() => {}}
              extractedUrls={extractedUrls}
              handleExtractText={() => {}}
              loadingtext={loadingtext}
              currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
              incident={incident}
              publicview={true}
              nextPageTokens={nextPageTokens}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              emailsPerPage={emailsPerPage}
              totalPages={{
                sent: Math.ceil(sentEmailCount / emailsPerPage),
                received: Math.ceil(receivedEmailCount / emailsPerPage),
              }}
            />
          {/* // ) : (
          //   <div>No email data available</div>
          // )} */}
        </div>
      </div>
    </>
  );
}

