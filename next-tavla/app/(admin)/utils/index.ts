import { VariantType } from '@entur/form'
import { FirebaseError } from 'firebase/app'
import { TOrganization, TUserID } from 'types/settings'

type InputType =
    | 'general'
    | 'user'
    | 'email'
    | 'password'
    | 'repeat_password'
    | 'name'
    | 'file'
    | 'column'
    | 'organization'
    | 'quay'
    | 'stop_place'

export type TFormFeedback = {
    form_type: InputType
    feedback?: string
    variant?: VariantType
}

export type TError = FirebaseError | string

export function getFormFeedbackForError(e?: TError): TFormFeedback {
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
        case 'auth/unverified':
            return {
                form_type: 'user',
                feedback:
                    'E-postadressen er ikke verifisert. Vi har sendt deg en e-post for å verifisere kontoen din.',
                variant: 'warning',
            }
        case 'auth/create':
            return {
                form_type: 'user',
                feedback:
                    'Kontoen din har blitt opprettet. Du har mottatt en e-post for å verifisere kontoen din.',
                variant: 'success',
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
                feedback: 'Du har ikke gitt organisasjonen et navn',
                variant: 'error',
            }
        case 'board/not-found':
            return {
                form_type: 'general',
                feedback: 'Denne tavla finnes ikke',
                variant: 'error',
            }
        case 'board/name-missing':
            return {
                form_type: 'name',
                feedback: 'Du har ikke gitt tavla et navn',
                variant: 'error',
            }
        case 'create/organization-missing':
            return {
                form_type: 'organization',
                feedback: 'Du har ikke valgt organisasjon',
                variant: 'error',
            }
        case 'board/tiles-missing':
            return {
                form_type: 'general',
                feedback: 'Du har ikke lagt til noen holdeplasser',
                variant: 'error',
            }
        case 'boards/tag-exists':
            return {
                form_type: 'general',
                feedback: 'Denne merkelappen finnes allerede',
                variant: 'error',
            }
        case 'organization/name-mismatch':
            return {
                form_type: 'name',
                feedback: 'Navnet på organisasjonen er ikke skrevet riktig',
                variant: 'error',
            }
        case 'organization/invalid-columns':
            return {
                form_type: 'column',
                feedback: 'Du må velge minst èn kolonne',
                variant: 'error',
            }
        case 'file/size-too-big': {
            return {
                form_type: 'file',
                feedback: 'Filen du prøver å laste opp er for stor.',
                variant: 'error',
            }
        }
        case 'create/quay-missing': {
            return {
                form_type: 'quay',
                feedback: 'Du har ikke valgt retning enda',
                variant: 'error',
            }
        }
        case 'create/stop_place-missing': {
            return {
                form_type: 'stop_place',
                feedback: 'Du har ikke valgt stoppested',
                variant: 'error',
            }
        }
        case 'reset/email-sent': {
            return {
                form_type: 'email',
                feedback:
                    'Vi har sendt deg en lenke for å nullstille passordet.',
                variant: 'success',
            }
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

export function userInOrganization(
    uid?: TUserID,
    organization?: TOrganization,
) {
    return (
        uid &&
        organization &&
        (organization.owners?.includes(uid) ||
            organization.editors?.includes(uid))
    )
}
