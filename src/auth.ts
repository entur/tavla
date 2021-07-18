import { useState, useEffect, useContext, createContext } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'

/**
 * If user is undefined, we don't know yet if user is logged in.
 * If user is null, we know there's not a logged in user
 * If user is User, we have a logged-in or anonymous user.
 */
export function useFirebaseAuthentication(): firebase.User | null | undefined {
    const [user, setUser] = useState<firebase.User | null | undefined>()

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((newUser) => {
            setUser(newUser)
            if (newUser) {
                return
            }
            // eslint-disable-next-line no-console
            firebase.auth().signInAnonymously().catch(console.error)
        })

        return unsubscribe
    }, [])

    return user
}

const UserContext = createContext<firebase.User | null | undefined>(null)

export const UserProvider = UserContext.Provider

export function useUser(): firebase.User | null | undefined {
    return useContext(UserContext)
}
