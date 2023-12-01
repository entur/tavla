import { VariantType } from '@entur/form'
import { FirebaseError } from 'firebase/app'

type InputType = 'general' | 'user' | 'email' | 'password' | 'repeat_password'

export type TFormFeedback = {
    form_type: InputType
    feedback?: string
    variant?: VariantType
}

export type TError = FirebaseError

export function getFormFeedbackForError(e: TError): TFormFeedback {
    switch (e.code) {
        case 'auth/invalid-email':
            return {
                form_type: 'email',
                feedback: 'E-postadressen er ikke gyldig.',
                variant: 'error',
            }
        case 'auth/user-disabled':
            return {
                form_type: 'user',
                feedback: 'Kontoen har blitt deaktivert',
                variant: 'error',
            }
        case 'auth/user-not-found':
            return {
                form_type: 'email',
                feedback:
                    'Det finnes ingen konto assosiert med denne e-postadressen.',
                variant: 'warning',
            }
        case 'auth/wrong-password':
            return {
                form_type: 'password',
                feedback: 'Passordet er ikke gyldig.',
                variant: 'error',
            }
        case 'auth/email-already-in-use':
            return {
                form_type: 'email',
                feedback: 'E-postadressen er allerede i bruk.',
                variant: 'warning',
            }
        case 'auth/weak-password':
            return {
                form_type: 'password',
                feedback: 'Passordet er for svakt.',
                variant: 'warning',
            }
        case 'auth/password-no-match':
            return {
                form_type: 'repeat_password',
                feedback: 'Passordene er ikke like.',
                variant: 'error',
            }
        case 'auth/too-many-requests':
            return {
                form_type: 'user',
                feedback:
                    'Kontoen har blitt midlertidig låst grunnet gjentatte mislykkede påloggingsforsøk.',
                variant: 'warning',
            }
        case 'auth/operation-not-allowed':
            return {
                form_type: 'user',
                feedback: 'Opprettelse av ny bruker feilet.',
                variant: 'error',
            }
        case 'auth/expired-action-code':
            return {
                form_type: 'user',
                feedback: 'Lenken du har fulgt er utgått.',
                variant: 'error',
            }
        case 'auth/invalid-action-code':
            return {
                form_type: 'user',
                feedback: 'Lenken du har fulgt er ugyldig.',
                variant: 'error',
            }
        case 'auth/missing-email':
            return {
                form_type: 'email',
                feedback: 'Skriv inn en e-postadresse.',
                variant: 'warning',
            }
    }

    return {
        form_type: 'general',
        feedback: 'En feil har oppstått',
        variant: 'error',
    }
}

export function getFormFeedbackForField(
    form_type: InputType,
    feedback?: TFormFeedback,
) {
    if (form_type === feedback?.form_type) return feedback
}
