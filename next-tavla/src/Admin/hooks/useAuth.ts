import { auth } from 'utils/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { fetchWithIdToken } from 'Admin/utils'

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
        if (password !== repeatPassword) return

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
