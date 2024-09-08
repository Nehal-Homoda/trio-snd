// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, OAuthProvider, GoogleAuthProvider, signInWithPopup, type UserCredential } from 'firebase/auth';
import { getMessaging, getToken, onMessage, } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHSeUPojtjhIVr-E6KRDhBMpbZZsy9rmI",
    authDomain: "trio-snd-plus.firebaseapp.com",
    projectId: "trio-snd-plus",
    storageBucket: "trio-snd-plus.appspot.com",
    messagingSenderId: "29178031889",
    appId: "1:29178031889:web:362b6bbe0cf2c6232626b0",
    measurementId: "G-TCDZ7W38VH"
};
// const firebaseConfig = {
//     apiKey: "AIzaSyBsytAti2G4xC2Tl9-2miOrG5yT1ziXVQg",
//     authDomain: "fcm-test-d2241.firebaseapp.com",
//     projectId: "fcm-test-d2241",
//     storageBucket: "fcm-test-d2241.appspot.com",
//     messagingSenderId: "510772282055",
//     appId: "1:510772282055:web:f6d486cf6d88ae5f46f4e2",
//     measurementId: "G-RELJSVENWY"
// };

const firebaseApps = getApps()

// Initialize Firebase
export const FIREBASE_APP = !!firebaseApps.length ? firebaseApps[0] : initializeApp(firebaseConfig);
// const analytics = getAnalytics(FIREBASE_APP);

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

googleProvider.setCustomParameters({
    prompt: "select_account"
});

// appleProvider.addScope('email');
// appleProvider.addScope('name');

export const auth = getAuth();
export const googleLoginPopup = () => signInWithPopup(auth, googleProvider)
export const appleLoginPopup = () => signInWithPopup(auth, appleProvider)
export const googleCredentialResult = (payload: UserCredential) => GoogleAuthProvider.credentialFromResult(payload)
export const appleCredentialResult = (payload: UserCredential) => OAuthProvider.credentialFromResult(payload)




export const initializeFirebaseMessaging = () => {


    const firebaseMessaging = getMessaging(FIREBASE_APP);





    return {
        firebaseMessaging,
    }

    // onMessage(firebaseMessaging, (payload) => {
    //     console.log('Message received. ', payload);
    //     // ...

    //     notify({
    //         type: 'success',
    //         title: payload.notification?.title,
    //         text: payload.notification?.body
    //     })
    // });
}

export const getDeviceToken = async () => {

    let token = (Math.random() * 10000000).toString();

    const getTokenListener = async () => {
        await getToken(initializeFirebaseMessaging().firebaseMessaging, { vapidKey: 'BLtTluPnrPi6FPqPY4pKy7-mORMo-8PKrjVY4ip9XkL89nrzxrRHe8uPZ_jlW2sAEi86G6MEZUHxlrB2VFdHFmU' })
        // await getToken(initializeFirebaseMessaging().firebaseMessaging, { vapidKey: 'BKBwyLnxGmVHeHRbrFzxCCjIAMJs2p6sRw-4BUtwWdJdGDSZ8kFKr3POG6Vb0-7UdD2AWFBbu_kE05gCh2zcGnY'})
        .then(currentToken => {

            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                
                token = currentToken;
                
            } else {
                // // Show permission request UI
                // console.log('No registration token available. Request permission to generate one.');
                
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });
    }





    try {

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            // If the user has already granted permission, create a notification
            // new Notification("You are already subscribed to notifications!");
            await getTokenListener();
            
        } else if (Notification.permission !== "denied") {
            // Otherwise, ask the user for permission
            await Notification.requestPermission()
            .then(async function (permission) {
                if (permission === "granted") {
                    // If the user accepts, create a notification
                    // new Notification("Thank you for enabling notifications!");
                    await getTokenListener();
                    
    
                } else {
                    // alert("Notifications are disabled. You can enable them in your browser settings.");
                }
            });
        } else {
            // The user has previously denied notifications
            // alert("You have denied notifications. To enable them, change your browser settings.");
        }
    } catch (error) {
        console.log('Firebase Notifications Permission error ', error);
    }

    return token;
}
