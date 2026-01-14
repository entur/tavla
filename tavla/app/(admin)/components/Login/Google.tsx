'use client'
import { BannerAlertBox } from '@entur/alert'
import { Paragraph } from '@entur/typography'
import * as Sentry from '@sentry/nextjs'
import { FirebaseError } from 'firebase/app'
import {
    GoogleAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    signInWithPopup,
} from 'firebase/auth'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import GoogleButton from 'react-google-button'
import { getClientApp } from 'utils/firebase'
import { create, login } from './actions'

export default function Google({ trackingEvent }: { trackingEvent: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(['', ''])
    const posthog = usePostHog()
    const googleAction = async () => {
        setIsLoading(true)
        setErrorMessage(['', ''])
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
            } else if (
                error instanceof FirebaseError &&
                error.code == 'auth/popup-blocked'
            ) {
                setIsLoading(false)
                setErrorMessage([
                    'Popup-vinduet ble blokkert.',
                    'Endre denne innstillingen i nettleseren din for å logge på med Google.',
                ])
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
        <div className="mb-4 flex w-full flex-col items-center justify-center [&>div]:!w-full">
            {isLoading ? (
                <Paragraph className="text-center">Vent litt...</Paragraph>
            ) : (
                <GoogleButton
                    className="mb-4 w-full"
                    type="light"
                    label="Logg inn med Google"
                    onClick={() => {
                        posthog.capture(trackingEvent)
                        googleAction()
                    }}
                />
            )}

            {errorMessage[0] && (
                <BannerAlertBox
                    className="mt-10"
                    variant="information"
                    title={errorMessage[0]}
                >
                    {errorMessage[1]}
                </BannerAlertBox>
            )}
        </div>
    )
}
