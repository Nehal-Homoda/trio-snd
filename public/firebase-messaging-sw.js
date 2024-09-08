// // Import and configure the Firebase SDK
// // These scripts are made available when the app is served or deployed on Firebase Hosting
// // If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');


// /**
//  * Here is is the code snippet to initialize Firebase Messaging in the Service
//  * Worker when your app is not hosted on Firebase Hosting.

//  // Give the service worker access to Firebase Messaging.
//  // Note that you can only use Firebase Messaging here. Other Firebase libraries
//  // are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

//  // Initialize the Firebase app in the service worker by passing in
//  // your app's Firebase config object.
//  // https://firebase.google.com/docs/web/setup#config-object
//  firebase.initializeApp({
//    apiKey: 'api-key',
//    authDomain: 'project-id.firebaseapp.com',
//    databaseURL: 'https://project-id.firebaseio.com',
//    projectId: 'project-id',
//    storageBucket: 'project-id.appspot.com',
//    messagingSenderId: 'sender-id',
//    appId: 'app-id',
//    measurementId: 'G-measurement-id',
//  });

//  // Retrieve an instance of Firebase Messaging so that it can handle background
//  // messages.
//  const messaging = firebase.messaging();
//  **/


// // If you would like to customize notifications that are received in the
// // background (Web app is closed or not in browser focus) then you should
// // implement this optional method.
// // Keep in mind that FCM will still show notification messages automatically 
// // and you should use data messages for custom notifications.
// // For more info see: 
// // https://firebase.google.com/docs/cloud-messaging/concept-options
// firebase.initializeApp({
//     apiKey: "AIzaSyBsytAti2G4xC2Tl9-2miOrG5yT1ziXVQg",
//     authDomain: "fcm-test-d2241.firebaseapp.com",
//     projectId: "fcm-test-d2241",
//     storageBucket: "fcm-test-d2241.appspot.com",
//     messagingSenderId: "510772282055",
//     appId: "1:510772282055:web:f6d486cf6d88ae5f46f4e2",
//     measurementId: "G-RELJSVENWY"
// });
firebase.initializeApp({
    apiKey: "AIzaSyAHSeUPojtjhIVr-E6KRDhBMpbZZsy9rmI",
    authDomain: "trio-snd-plus.firebaseapp.com",
    projectId: "trio-snd-plus",
    storageBucket: "trio-snd-plus.appspot.com",
    messagingSenderId: "29178031889",
    appId: "1:29178031889:web:362b6bbe0cf2c6232626b0",
    measurementId: "G-TCDZ7W38VH"
});

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});


// Handle notification clicks
// self.addEventListener('notificationclick', function (event) {
//     console.log('SW notification click event', event)
//     const url = 'localhost:3000'
//     event.waitUntil(
//         clients.matchAll({ type: 'window' }).then(windowClients => {
//             // Check if there is already a window/tab open with the target URL
//             for (var i = 0; i < windowClients.length; i++) {
//                 var client = windowClients[i];
//                 // If so, just focus it.
//                 if (client.url === url && 'focus' in client) {
//                     return client.focus();
//                 }
//             }
//             // If not, then open the target URL in a new window/tab.
//             // if (clients.openWindow) {
//             //     return clients.openWindow(url);
//             // }
//         })
//     );
// })
