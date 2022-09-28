import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


// Your web app's Firebase configuration (get this from firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyAoIYO6EipyIS7ut8784UNN0BTmR8qFdis",
    authDomain: "project-two-8bf54.firebaseapp.com",
    projectId: "project-two-8bf54",
    storageBucket: "project-two-8bf54.appspot.com",
    messagingSenderId: "102875755186",
    appId: "1:102875755186:web:9f66fe6cf52f43c97e8fab"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initalize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const storage = firebase.storage();
