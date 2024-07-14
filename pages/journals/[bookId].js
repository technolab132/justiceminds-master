import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js";
import LoadingComponent from "../../components/LoadingComponent";
import PageFlip from 'react-pageflip';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JournalDetails = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [isLoading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [bgImgUrl, setBgImgUrl] = useState(""); 

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('pagecontent')
          .filter('bookId', 'eq', bookId)
          .order('pageNo', { ascending: true });
        if (pagesError) {
          throw pagesError;
        }
        // Convert pagecontent into array of divs
        const pageDivs = pagesData.map((page, index) => (
          <div key={index} className='bg-[#1d1d1d] rounded-xl p-8 border-r-5 border-r border-[#000] font-[Space Grotesk]'><div
          id="agency-content"
          dangerouslySetInnerHTML={{
            __html: page.pagecontent,
          }}
        ></div></div>
        ));
        setPages(pageDivs);

        // Fetch bgimg
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('bgimg')
          .eq('id', bookId)
          .single();
        if (bookError) {
          throw bookError;
        }
        // Set the background image URL
        setBgImgUrl(bookData.bgimg);
      } catch (error) {
        console.error('Error fetching pages:', error.message);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchPages();
      console.log(bgImgUrl);
    }
  }, [bookId]);

  return (
    <div style={{background:`url(${bgImgUrl})`, backgroundSize:"cover"}} className="main hidden sm:flex justify-center items-center h-screen bg-[#000]">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        // {console.log(bgImgUrl)}
        <PageFlip
          className=""
          width={400}
          maxShadowOpacity={0.3}
          height={600}
          page={0} // Set the initial page index to 0 (first page)
          showCover={true} // Show the cover page
        >
          {pages}
        </PageFlip>
      )}
    </div>
  );
}

export default JournalDetails;
