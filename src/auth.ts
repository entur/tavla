import { useState, useEffect, useContext, createContext } from 'react'

import firebase, { User } from 'firebase/app'
import 'firebase/auth'

export function useAnonymousLogin(): User | null {
    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(newUser => {
            if (newUser) {
                setUser(newUser)
                return
            }
            setUser(null)
            firebase
                .auth()
                .signInAnonymously()
                .catch(console.error)
        })

        return unsubscribe
    }, [])

    return user
}

const UserContext = createContext<User | null>(null)

export const UserProvider = UserContext.Provider

export function useUser(): User {
    return useContext(UserContext)
}
