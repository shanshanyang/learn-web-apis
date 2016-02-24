# learn-web-apis

## offline data-storage 

(recommended lib https://github.com/mozilla/localForage, or Dexie(http://dexie.org/), use IndexedDB for browsers support it,
fall back to `WebSQL` (like safari), then `localstorage` for basic support browser)
    - IndexedDB
    - localStorage
    - Application Cache
    - XMLHttpRequest
    
## offline-app
    - offline detection mechanisms / library (offline.js)
    - use `indexedDB` for complex web app offline asset storage
    - `serviceworker` will be a better solution for offline asset storage and use.
    
