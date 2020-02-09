import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBO9bteDEjGaWkyl7R5ArRqjvwhO8DsqWo",
    authDomain: "react-slack-chat-b016f.firebaseapp.com",
    databaseURL: "https://react-slack-chat-b016f.firebaseio.com",
    projectId: "react-slack-chat-b016f",
    storageBucket: "react-slack-chat-b016f.appspot.com",
    messagingSenderId: "67286142617",
    appId: "1:67286142617:web:31afc7d01a283547f1b208",
    measurementId: "G-VYFM5YW4DZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;