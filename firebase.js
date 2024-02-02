import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCK2ARyGmwknH46Z-5oYEvv8Lt3-1dEOZI",
    authDomain: "skapca-snakes.firebaseapp.com",
    projectId: "skapca-snakes",
    storageBucket: "skapca-snakes.appspot.com",
    messagingSenderId: "705347048287",
    appId: "1:705347048287:web:2fa746fb6c8814f7179cea",
    measurementId: "G-K33PS99Y2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
// const ref = database.ref('scores');


async function addEntry(name, score) {
    // await setDoc(doc(db, "scores"), data);

    await addDoc(collection(db, "scores"), {
        'name': name,
        'score': score,
    });

}

async function getTopTen() {

    let ret = [];
    const query = await getDocs(collection(db, "scores"));
    query.forEach(doc => {
        ret.push([doc.data().name, doc.data().score]);
    });

    return ret;

}

async function getBestScore() {

    let ret = 0;
    const query = await getDocs(collection(db, "scores"));
    query.forEach(doc => {
        ret = Math.max(ret, doc.data());
    });

    return ret;

}

export { addEntry, getTopTen, getBestScore };
