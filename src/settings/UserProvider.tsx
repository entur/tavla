import React, { useState, useEffect, useContext, createContext } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from './firebase-init'

/**
 * If user is undefined, we don't know yet if user is logged in.
 * If user is null, we know there's not a logged in user
 * If user is User, we have a logged-in or anonymous user.
 */
function useFirebaseAuthentication(): User | null | undefined {
    const [user, setUser] = useState<User | null | undefined>()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            setUser(newUser)
            if (newUser) {
                return
            }
            // eslint-disable-next-line no-console
            signInAnonymously(auth).catch(console.error)
        })

        return unsubscribe
    }, [])

    return user
}

const UserContext = createContext<User | null | undefined>(null)

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const user = useFirebaseAuthentication()
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

function useUser(): User | null | undefined {
    return useContext(UserContext)
}

export { auth, UserProvider, useUser }
