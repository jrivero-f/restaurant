import firebase from "firebase/app";

const firebaseConfig = {
        apiKey: "AIzaSyB6hsZvsQfu2nzXQXoSuTQ3bg9i7MQDaA4",
        authDomain: "mi-fondita-15651.firebaseapp.com",
        projectId: "mi-fondita-15651",
        storageBucket: "mi-fondita-15651.appspot.com",
        messagingSenderId: "463000150991",
        appId: "1:463000150991:web:76914da3a832d9e34ba8ba"
};


export const firebaseApp = firebase.initializeApp(firebaseConfig);