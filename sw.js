/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "framework-6c480ce1ccc3e017629d.js"
  },
  {
    "url": "app-b0b2a5f71405d9bffcd8.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "bf140f705c965175d90325d002437622"
  },
  {
    "url": "webpack-runtime-413356275ddab307df5c.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-b5c5e98488572b7323ed.js"
  },
  {
    "url": "polyfill-832962edc39683cd2b69.js"
  },
  {
    "url": "styles.b46d25d0432ff77bdacd.css"
  },
  {
    "url": "b6072d74c1b7d5694886f2b5bb66a6b6bb6a7df4-1028b07cd8b2b4a06adb.js"
  },
  {
    "url": "4e29b3c1044f091454532221b4cacdac14bda2e8-42e444cc855b4abbc4be.js"
  },
  {
    "url": "component---src-pages-index-tsx-dc3c0da3f8ff8024f071.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "072876287d33dc1fefc63e1174d931a0"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "baa6cc2c1019213137c00c049c348386"
  },
  {
    "url": "component---src-pages-about-tsx-838d2a61af38d7ca8b64.js"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "bcea690ce3f71d390a08ba9805c167bb"
  },
  {
    "url": "component---src-pages-projects-tsx-2d69ce4edd6390a508b0.js"
  },
  {
    "url": "page-data/projects/page-data.json",
    "revision": "b54d52b63fb8ae7a3ebba81230cfa50c"
  },
  {
    "url": "component---src-pages-uses-tsx-c3e63a3aea4470849a47.js"
  },
  {
    "url": "page-data/uses/page-data.json",
    "revision": "8438c949ebf7e36a7d89197f9478a4b3"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "30dcf74db292c48d2fa7da670c96d45e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-b0b2a5f71405d9bffcd8.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
