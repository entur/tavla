import { VariantType } from '@entur/form'
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'

type TErrorType = 'email' | 'password' | 'user'
type TAuthError = { type: TErrorType; value: string }

function useFirebaseAuthError(): {
    error: TAuthError | undefined
    setError: typeof setErrorMessage
    getTextFieldPropsForType: typeof getTextFieldPropsForType
} {
    const [error, setError] = useState<TAuthError>()

    const getTextFieldPropsForType = (
        type: TErrorType,
    ): { variant?: VariantType | undefined; feedback?: string } => {
        return {
            variant: type === error?.type ? 'error' : undefined,
            feedback: error?.value,
        }
    }

    const setErrorMessage = (error: FirebaseError) => {
        switch (error.code) {
            case 'auth/invalid-email':
                return setError({
                    type: 'email',
                    value: 'E-postadressen er ikke gyldig.',
                })
            case 'auth/user-not-found':
                return setError({
                    type: 'email',
                    value: 'Det finnes ingen konto assosiert med denne e-postadressen.',
                })
            case 'auth/wrong-password':
                return setError({
                    type: 'password',
                    value: 'Passordet er ikke gyldig.',
                })
            case 'auth/user-disabled':
                return setError({
                    type: 'user',
                    value: 'Kontoen du forsøker å logge inn på er deaktivert.',
                })
            case 'auth/too-many-requests':
                return setError({
                    type: 'user',
                    value: 'Kontoen har blitt midlertidig låst grunnet gjentatte mislykkede påloggingsforsøk.',
                })
        }
    }

    return { error, setError: setErrorMessage, getTextFieldPropsForType }
}

export { useFirebaseAuthError }
