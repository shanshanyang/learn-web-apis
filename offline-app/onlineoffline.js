// You need to know when the user comes back online, so that you can re-synchronize with the server.
// You need to know when the user is offline, so that you can be sure to queue your server requests for a later time.
console.log(navigator.onLine); //true | false
// "online" does not always mean connection to the internet, it can also just mean connection to some network. 
// false when switching to/from the browser's Offline mode
// false when losing/regaining network connectivity in Windows and Linux.
window.addEventListener("online", function () {});
window.document.addEventListener("online", function () {});
window.document.body.addEventListener("online", function () {}); //IE8 support

window.addEventListener("offline", function () {});
window.document.addEventListener("offline", function () {});
window.document.body.addEventListener("offline", function () {}); //IE8 support