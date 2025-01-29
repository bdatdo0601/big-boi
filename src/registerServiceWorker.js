import join from 'url-join'

const store = {
  ready: false,
  update: false,
  error: false,
  offline: false
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      store.ready = true
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Force contents to update on reload.
              if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' })
              }
              // Timeout to ensure message passed.
              setTimeout(() => { store.update = true }, 100)
            }
          }
        }
      }
    })
    // biome-ignore lint/style/noRestrictedGlobals: <explanation>
    .catch(() => { error = true })
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        registerValidSW(swUrl)
      }
    })
    .catch(() => { store.offline = true })
}

export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      store.error = true
      return
    }

    window.addEventListener('load', () => {
      const swUrl = join(process.env.PUBLIC_URL, '/service-worker.js')

      if (isLocalhost) {
        checkValidServiceWorker(swUrl)
        navigator.serviceWorker.ready.then(() => Todo.setReady())
      } else {
        registerValidSW(swUrl)
      }
    })
  }
}

// Useful if you had a worker registered in the past on this url.
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => { store.error = error.message })
  }
}