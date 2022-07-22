import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDhJQ5e2hX6tBWkhtmJm-dI-g-9jt9Ak0A",
  authDomain: "pensiun-hebat.firebaseapp.com",
  projectId: "pensiun-hebat",
  storageBucket: "pensiun-hebat.appspot.com",
  messagingSenderId: "630425012942",
  appId: "1:630425012942:web:6ecb823b338f92f4759e9f",
  measurementId: "G-6GLPHTH307"
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