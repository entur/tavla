'use client'
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    getAdditionalUserInfo,
} from 'firebase/auth'
import { getClientApp } from 'utils/firebase'
import { create, login } from './actions'
import GoogleButton from 'react-google-button'
import * as Sentry from '@sentry/nextjs'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { Paragraph } from '@entur/typography'
import { FirebaseError } from 'firebase/app'

export default function Google() {
    const [isLoading, setIsLoading] = useState(false)
    const posthog = usePostHog()
    const googleAction = async () => {
        setIsLoading(true)
        const provider = new GoogleAuthProvider()
        const app = await getClientApp()
        const auth = getAuth(app)
        try {
            const credential = await signInWithPopup(auth, provider)
            const userIdToken = await credential.user.getIdToken()
            if (getAdditionalUserInfo(credential)?.isNewUser) {
                await create(credential.user.uid)
            }
            await login(userIdToken)
            setIsLoading(false)
        } catch (error) {
            if (
                error instanceof FirebaseError &&
                (error.code == 'auth/popup-closed-by-user' ||
                    error.code == 'auth/cancelled-popup-request')
            ) {
                setIsLoading(false)
            } else {
                Sentry.captureException(error, {
                    extra: {
                        message:
                            'Error while creating new user with Google sign in',
                    },
                })
                throw error
            }
        }
    }

    return (
        <div className="w-full [&>div]:!w-full">
            {isLoading ? (
                <Paragraph className="text-center">Vent litt....</Paragraph>
            ) : (
                <GoogleButton
                    type="light"
                    label="Logg inn med Google"
                    onClick={() => {
                        posthog.capture('LOG_IN_WITH_GOOGLE_BTN_CLICK')
                        googleAction()
                    }}
                />
            )}
        </div>
    )
}
