import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBry7iC5TsPqS0QAu9tDFg46zP1NY018mU",
  authDomain: "chatty-c1a1c.firebaseapp.com",
  databaseURL: "https://chatty-c1a1c.firebaseio.com",
  projectId: "chatty-c1a1c",
  storageBucket: "chatty-c1a1c.appspot.com",
  messagingSenderId: "377715460836",
  appId: "1:377715460836:web:0353e692582d5464c4baf1",
  measurementId: "G-CKJ4LZE5XD"
};

const firebase = initializeApp(firebaseConfig);
const messaging = getMessaging(firebase);

onBackgroundMessage(messaging, function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});