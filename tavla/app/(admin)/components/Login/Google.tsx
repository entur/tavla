'use client'
import { BannerAlertBox } from '@entur/alert'
import { SecondaryButton } from '@entur/button'
import { Paragraph } from '@entur/typography'
import * as Sentry from '@sentry/nextjs'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import GoogleLogo from 'assets/logos/google/GoogleLogo.svg'
import { FirebaseError } from 'firebase/app'
import {
    GoogleAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    signInWithPopup,
} from 'firebase/auth'
import Image from 'next/image'
import { useState } from 'react'
import { getClientApp } from 'src/utils/firebase'
import { create, login } from './actions'

type Props = {
    userTrackingContext: EventProps<'user_login_method_selected'>['context']
    trackingLocation: EventProps<'user_login_method_selected'>['location']
}

export default function Google({
    userTrackingContext: trackingContext,
    trackingLocation,
}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(['', ''])
    const posthog = usePosthogTracking()

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
        <div className="mb-4 flex w-full flex-col items-center">
            {isLoading ? (
                <Paragraph className="mt-2" margin="none">
                    Vent litt...
                </Paragraph>
            ) : (
                <SecondaryButton
                    onClick={() => {
                        posthog.capture('user_login_method_selected', {
                            location: trackingLocation,
                            method: 'google',
                            context: trackingContext,
                        })
                        googleAction()
                    }}
                    width="fluid"
                >
                    <Image
                        src={GoogleLogo}
                        alt="Google logo"
                        className="mr-1"
                    />
                    Logg inn med Google
                </SecondaryButton>
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
