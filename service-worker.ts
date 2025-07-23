import join from 'url-join';
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim(); // Allows updating open service workers.

const PUBLIC_URL = process.env.PUBLIC_URL || 'https://datbdo.com';

// Add types for the plugin and workbox.
declare global {
  interface Window {
    INJECT_MANIFEST_PLUGIN: { url: string; revision: string }[];
    skipWaiting: Function;
  }
}

// Add all assets generated during build to the browser cache.
// biome-ignore lint/style/noRestrictedGlobals: service worker logic
precacheAndRoute(self.INJECT_MANIFEST_PLUGIN);

const fileExtensionRegexp = /\/[^\/?]+\.[^\/]+$/;
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(join(PUBLIC_URL as string, '/index.html'))
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  // biome-ignore lint/style/noRestrictedGlobals: service worker logic
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Update cached assets after reload without the need for the user to close all open tabs.
// biome-ignore lint/style/noRestrictedGlobals: service worker logic
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // biome-ignore lint/style/noRestrictedGlobals: service worker logic
    self.skipWaiting();
  }
});
