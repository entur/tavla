import { VariantType } from '@entur/utils'
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

export function getFormFeedbackForField(
    form_type: InputType,
    feedback?: TFormFeedback,
) {
    if (form_type === feedback?.form_type) return feedback
}

export function getFormFeedbackForError(
    e?: TError,
    email?: string,
): TFormFeedback {
    let code = e
    if (e instanceof FirebaseError) {
        code = e.code
    }
    switch (code) {
        case 'auth/invalid-email':
            return {
                form_type: 'email',
                feedback: 'E-postadressen er ikke gyldig.',
                variant: 'negative',
            }
        case 'auth/user-disabled':
            return {
                form_type: 'user',
                feedback: 'Kontoen har blitt deaktivert.',
                variant: 'negative',
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
                variant: 'negative',
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
                feedback: `E-postadressen er ikke verifisert. Vi har sendt en verifiseringslenke til ${email}.`,
                variant: 'warning',
            }
        case 'auth/create':
            return {
                form_type: 'user',
                feedback: `Brukeren din er opprettet! Før du er i mål, må du åpne verifiseringslenken som har blitt sendt til ${email}.`,
                variant: 'success',
            }
        case 'auth/password-no-match':
            return {
                form_type: 'repeat_password',
                feedback: 'Passordene er ikke like.',
                variant: 'negative',
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
                variant: 'negative',
            }
        case 'auth/expired-action-code':
            return {
                form_type: 'user',
                feedback: 'Lenken du har fulgt er utgått.',
                variant: 'negative',
            }
        case 'auth/invalid-action-code':
            return {
                form_type: 'user',
                feedback: 'Lenken du har fulgt er ugyldig.',
                variant: 'negative',
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
                variant: 'negative',
            }
        case 'organization/user-already-invited':
            return {
                form_type: 'general',
                feedback: 'Denne personen er allerede medlem av organisasjoen.',
                variant: 'information',
            }
        case 'organization/name-missing':
            return {
                form_type: 'name',
                feedback: 'Du har ikke gitt organisasjonen et navn',
                variant: 'negative',
            }
        case 'board/not-found':
            return {
                form_type: 'general',
                feedback: 'Denne tavla finnes ikke',
                variant: 'negative',
            }
        case 'board/name-missing':
            return {
                form_type: 'name',
                feedback: 'Du har ikke gitt tavla et navn',
                variant: 'negative',
            }
        case 'create/organization-missing':
            return {
                form_type: 'organization',
                feedback: 'Du har ikke valgt organisasjon',
                variant: 'negative',
            }
        case 'board/tiles-missing':
            return {
                form_type: 'general',
                feedback: 'Du har ikke lagt til noen stoppesteder',
                variant: 'negative',
            }
        case 'board/tiles-name-missing':
            return {
                form_type: 'name',
                feedback: 'Navnet kan ikke være tomt',
                variant: 'negative',
            }
        case 'boards/tag-exists':
            return {
                form_type: 'general',
                feedback: 'Denne merkelappen finnes allerede',
                variant: 'negative',
            }
        case 'organization/name-mismatch':
            return {
                form_type: 'name',
                feedback: 'Navnet på organisasjonen er ikke skrevet riktig',
                variant: 'negative',
            }
        case 'delete/email-mismatch':
            return {
                form_type: 'email',
                feedback: 'E-posten samsvarer ikke med kontoen din',
                variant: 'negative',
            }
        case 'organization/invalid-columns':
            return {
                form_type: 'column',
                feedback: 'Du må velge minst èn kolonne',
                variant: 'negative',
            }
        case 'file/invalid':
            return {
                form_type: 'file',
                feedback:
                    'Du må legge til en gyldig fil (APNG, JPEG, PNG, SVG, GIP, WEBP).',
                variant: 'negative',
            }
        case 'file/size-too-big': {
            return {
                form_type: 'file',
                feedback: 'Filen du prøver å laste opp er for stor.',
                variant: 'negative',
            }
        }
        case 'create/quay-missing': {
            return {
                form_type: 'quay',
                feedback: 'Du har ikke valgt retning enda',
                variant: 'negative',
            }
        }
        case 'create/stop_place-missing': {
            return {
                form_type: 'stop_place',
                feedback: 'Du har ikke valgt stoppested',
                variant: 'negative',
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
        case 'tags/name-missing': {
            return {
                form_type: 'general',
                feedback:
                    'Merkelappen kan ikke være tom eller bare bestå av mellomrom.',
                variant: 'negative',
            }
        }
        case 'file/rate-limit': {
            return {
                form_type: 'file',
                feedback: 'Noe gikk galt. Vennligst prøv igjen senere',
                variant: 'negative',
            }
        }
        case 'firebase/general': {
            return {
                form_type: 'general',
                feedback: 'En teknisk feil har oppstått. Vennligst prøv igjen.',
                variant: 'negative',
            }
        }
        case 'contact/message-missing': {
            return {
                form_type: 'user',
                feedback: 'Vennligst legg igjen en melding.',
                variant: 'negative',
            }
        }
    }

    return {
        form_type: 'general',
        feedback: 'En feil har oppstått.',
        variant: 'negative',
    }
}

export function userInOrganization(
    uid?: TUserID,
    organization?: TOrganization,
) {
    return uid && organization && organization.owners?.includes(uid)
}
