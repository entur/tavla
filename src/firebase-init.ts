import firebase from 'firebase/app'

if (!process.env.FIREBASE_CONFIG) {
    // eslint-disable-next-line no-console
    console.error('The environment variable FIREBASE_CONFIG is missing!')
} else {
    firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG))
}
