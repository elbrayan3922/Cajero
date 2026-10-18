// Conexión a Firebase (proyecto propio caja-60aaa)
import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyDPZKFA3bS-JHQSl-9YzxNXwyNxAo1J_t0",authDomain:"caja-60aaa.firebaseapp.com",projectId:"caja-60aaa",storageBucket:"caja-60aaa.firebasestorage.app",messagingSenderId:"170377471984",appId:"1:170377471984:web:c38100d5f131e4a0fc5f35"};
const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
export {GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,sendEmailVerification,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
export {collection,doc,setDoc,addDoc,updateDoc,deleteDoc,onSnapshot,runTransaction,query,where,increment,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
