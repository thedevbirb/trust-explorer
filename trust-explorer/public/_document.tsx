import Head from "next/head";

const MyDocument = () => {
  return (
    <html>
      <Head>
        {/* Standard favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Apple Touch Icon (for iOS devices) */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Other favicon formats */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Microsoft Internet Explorer */}
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  );
};

export default MyDocument;
