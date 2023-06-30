// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, updateDoc, getDoc } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let app;
let db;
let gridDoc;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};

// Initialize Firebase

function getFirestuff() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    gridDoc = doc(db, "pixel-map/grid");
  }
  return [app, db, gridDoc];
}

async function addData(data) {
  const [,, gridDoc] = getFirestuff();
  try {
    await updateDoc(gridDoc, data);
  } catch (e) {
    console.error("-> error adding document: ", e);
  }
}

async function getData() {
  const [,, gridDoc] = getFirestuff();
  const docSnap = await getDoc(gridDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  } else {
    console.log("-> No such document!");
  }
};

export { getFirestuff, addData, getData }