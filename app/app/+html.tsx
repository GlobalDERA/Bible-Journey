// Root HTML for web (static export) - links PWA manifest.
// Required so browsers know this is installable.

import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#2B4C7E" />
        <meta name="description" content="Bible Journey - Read the Bible. Understand the Bible. Remember the Bible." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js').catch(function(e){ console.log('SW failed', e); }); }); }`,
          }}
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
