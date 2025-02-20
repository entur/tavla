import {
    GoogleAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    signInWithPopup,
} from 'firebase/auth'
import { create, login } from './actions'
import GoogleButton from 'react-google-button'
import * as Sentry from '@sentry/nextjs'

export default function Google() {
    const googleAction = async () => {
        const provider = new GoogleAuthProvider()
        const auth = getAuth()
        try {
            const credential = await signInWithPopup(auth, provider)
            const userIdToken = await credential.user.getIdToken()
            if (getAdditionalUserInfo(credential)?.isNewUser) {
                await create(credential.user.uid)
            }
            await login(userIdToken)
        } catch (error) {
            Sentry.captureException(error, {
                extra: {
                    message:
                        'Error while creating new user with Google sign in',
                },
            })
        }
    }

    return (
        <GoogleButton
            type="light"
            label="Logg inn med Google"
            onClick={() => {
                googleAction()
            }}
        />
    )
}
