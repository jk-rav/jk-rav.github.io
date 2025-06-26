import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDi3jkVvltaxKJbxbWt2SlwTum_dOk30rI",

  authDomain: "reno-checker.firebaseapp.com",

  projectId: "reno-checker",
  storageBucket: "reno-checker.firebasestorage.app",
  messagingSenderId: "852244918302",
  appId: "1:852244918302:web:c9a3ba41e0814ef275be0f",
  measurementId: "G-MK1TJMH8HN"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);