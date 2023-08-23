import { fetchWithIdToken } from 'Admin/utils'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from 'utils/firebase'

import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/router'

function useAuth() {
    const router = useRouter()

    const login = async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        )
        await fetchWithIdToken('/api/login', await credential.user.getIdToken())
        router.reload()
    }

    const logout = async () => {
        await fetch('/api/logout')
        router.reload()
    }

    const createUser = async (
        email: string,
        password: string,
        repeatPassword: string,
    ) => {
        if (password !== repeatPassword)
            throw new FirebaseError(
                'auth/password-no-match',
                'passwords does not match',
            )

        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        )
        await fetchWithIdToken('/api/login', await credential.user.getIdToken())
        router.reload()
    }

    return { login, logout, createUser }
}

export { useAuth }
