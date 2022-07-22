import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// let messaging: Messaging | undefined = undefined;
// let app = undefined;

// if (!firebase.getApps().length) {
//   app = initializeApp(firebaseConfig);
// }

// try {
//   messaging = getMessaging(app);
// } catch (e) {
//   console.log(e);
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const getFCMToken = () => {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject({ message: 'firebase messaging is not supported' });
      return;
    }

    getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_PUBLIC_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          resolve(currentToken);
          // Track the token -> client mapping, by sending to backend server
          // show on the UI that permission is secured
        } else {
          console.log(
            'No registration token available. Request permission to generate one.',
          );
          // shows on the UI that permission is required
          reject({ message: 'No registration token available' });
        }
      })
      .catch((err: any) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
        reject(err);
      });
  });
};

export const onMessageListener = () => {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject({ message: 'firebase messaging is not supported' });
      return;
    }

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
