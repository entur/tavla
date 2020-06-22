import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

let appSingleton: undefined | firebase.app.App | Promise<firebase.app.App>

/*
 * Initializes the Firebase app. It is safe to call multiple times – only one instance will be created
 */
export default async function initializeFirebase(): Promise<firebase.app.App> {
    if (appSingleton) {
        return appSingleton
    }

    if (process.env.FIREBASE_CONFIG) {
        appSingleton = firebase.initializeApp(
            JSON.parse(process.env.FIREBASE_CONFIG),
        )
        return appSingleton
    }

    appSingleton = fetch('/__/firebase/init.json').then(async response => {
        return firebase.initializeApp(await response.json())
    })

    return appSingleton
}

export function useIsFirebaseInitialized(): boolean {
    const [initialized, setInitialized] = useState<boolean>(false)

    useEffect(() => {
        initializeFirebase().then(() => setInitialized(true))
    }, [])

    return initialized
}
