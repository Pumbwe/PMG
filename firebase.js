// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "747618557926",
  appId: "YOUR_WEB_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Request permission and get FCM token
messaging.getToken({
  vapidKey: "BClJX8XmfZ7KO9dC1PpLx-SaHa0nKHBhEMxPh0ASN176LVkiGZwMRXXkvW3V9a0NI8VebknaveZZFcZUES2OsQU"
})
.then((currentToken) => {
  if (currentToken) {
    console.log("FCM Token:", currentToken);
  } else {
    console.log("No registration token available.");
  }
})
.catch((err) => {
  console.log("An error occurred while retrieving token.", err);
});

// Handle foreground messages
messaging.onMessage((payload) => {
  alert(payload.notification.title + "\n" + payload.notification.body);
});
