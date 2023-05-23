import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore } from 'firebase/firestore';
import { Modal } from 'antd';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const firestore = getFirestore(app);

// Request permission
const requestNotificationPermission = async () => {
  const permissionResult = await Notification.requestPermission();
  return permissionResult;
};

// Check current permission status
const checkNotificationPermission = async () => {
  const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
  return permissionStatus.state;
};

const handleNotificationPermission = () => {
  return new Promise((resolve, reject) => {
    checkNotificationPermission()
      .then((permission) => {
        if (permission === 'granted') {
          resolve(permission);
        } else {
          Modal.confirm({
            title: 'Izin Notifikasi',
            content:
              'Anda belum memberikan izin untuk notifikasi. Hal ini dibutuhkan untuk dapat menerima notifikasi yang diperlukan.',
            okText: 'Izinkan',
            cancelText: 'Tutup',
            onOk: () => {
              requestNotificationPermission()
                .then((result) => {
                  if (result === 'granted') {
                    resolve(permission);
                  } else if (result === 'denied') {
                    reject({
                      message:
                        'Izin notifikasi ditolak. Silahkan izinkan notifikasi secara manual melalui pengaturan izin browser anda',
                    });
                  }
                })
                .catch((e) => reject(e));
            },
          });
        }
      })
      .catch((e) => reject(e));
  });
};

export const getFCMToken = () => {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject({ message: 'firebase messaging is not supported' });
      return;
    }

    if (!('Notification' in window) && !navigator.permissions) {
      reject({
        message: 'Notification API or Permissions API not supported in this browser',
      });
    }

    handleNotificationPermission()
      .then(() => {
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
      })
      .catch((e) => reject(e));
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
