import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";


export default function Document() {
  // const router = useRouter()
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Cinzel+Decorative:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/jmlogosmall.png" type="image/x-icon" />
        <meta name="description" content="Justice Minds - Data-Driven Advocacy" />
        {/* <title>Justice Minds - Data-Driven Advocacy</title> */}
      </Head>
      <body className={`dark  crsw4`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
