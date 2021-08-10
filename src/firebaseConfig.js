var firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCqbvXjdXn6FntTK_HeJmH_jHGCVmPp47c",
  authDomain: "foreignbasket-df2e5.firebaseapp.com",
  databaseURL:
    "https://foreignbasket-df2e5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "foreignbasket-df2e5",
  storageBucket: "foreignbasket-df2e5.appspot.com",
  messagingSenderId: "213245806986",
  appId: "1:213245806986:web:46c4b6929b1ec86b99a073",
  measurementId: "G-7RYZM315HC"
};

firebase.initializeApp(firebaseConfig);

module.exports = { firebase };
