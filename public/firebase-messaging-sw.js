importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,notificationOptions);
});