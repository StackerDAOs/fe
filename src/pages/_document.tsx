import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import theme from 'theme';

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel='shortcut icon' href='/img/logo-only.png' />
          <link rel='apple-touch-icon' href='/img/logo-only.png' />
          <link rel='manifest' href='/manifest.json' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400&display=swap'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400&family=Lato:wght@100;300;400&display=swap'
          />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
