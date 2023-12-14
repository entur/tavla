import { VariantType } from '@entur/form'
import { FirebaseError } from 'firebase/app'

type InputType =
    | 'general'
    | 'user'
    | 'email'
    | 'password'
    | 'repeat_password'
    | 'name'

export type TFormFeedback = {
    form_type: InputType
    feedback?: string
    variant?: VariantType
}

export type TError = FirebaseError | string

export function getFormFeedbackForError(e: TError): TFormFeedback {
    let code = e
    if (e instanceof FirebaseError) {
        code = e.code
    }
    switch (code) {
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
                form_type: 'general',
                feedback: 'Du har ikke tilgang til å utføre denne operasjonen',
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
        case 'organization/not-found':
            return {
                form_type: 'general',
                feedback: 'Fant ikke organisasjonen',
                variant: 'error',
            }
        case 'organization/user-already-invited':
            return {
                form_type: 'general',
                feedback: 'Denne personen er allerede medlem av organisasjoen.',
                variant: 'info',
            }
        case 'organization/name-missing':
            return {
                form_type: 'name',
                feedback: 'Organisasjonen må ha et navn',
                variant: 'warning',
            }
        case 'board/not-found':
            return {
                form_type: 'general',
                feedback: 'Denne tavla finnes ikke',
                variant: 'error',
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
