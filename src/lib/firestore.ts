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
  apiKey: "AIzaSyCkVlNGoV6z7XKVeKJD6KgFZr6UKLBr1H4",
  authDomain: "tiny-huge-canvas.firebaseapp.com",
  projectId: "tiny-huge-canvas",
  storageBucket: "tiny-huge-canvas.appspot.com",
  messagingSenderId: "339887616061",
  appId: "1:339887616061:web:da00e97e8bd317880dfa54"
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
    console.log("-> document data is stored");
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
    // doc.data() will be undefined in this case
    console.log("-> No such document!");
  }
};

export { getFirestuff, addData, getData }