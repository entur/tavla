import { VariantType } from '@entur/form'
import { TAuthError, TErrorType } from 'Admin/types/login'
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'

function useFirebaseAuthError() {
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
            case 'auth/email-already-in-use':
                return setError({
                    type: 'email',
                    value: 'E-postadressen er allerede i bruk.',
                })
            case 'auth/wrong-password':
                return setError({
                    type: 'password',
                    value: 'Passordet er ikke gyldig.',
                })
            case 'auth/weak-password':
                return setError({
                    type: 'password',
                    value: 'Passordet er for svakt.',
                })
            case 'auth/password-no-match':
                return setError({
                    type: 'repeat_password',
                    value: 'Passordene er ikke like.',
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
            case 'auth/operation-not-allowed':
                return setError({
                    type: 'user',
                    value: 'Opprettelse av ny bruker feilet.',
                })
        }
    }

    return { error, setError: setErrorMessage, getTextFieldPropsForType }
}

export { useFirebaseAuthError }
