import { VariantType } from '@entur/form'

type ErrorCode = 'error' | 'auth/not-allowed'

type InviteErrorCode = 'invite/user-not-found' | 'invite/already-invited'
type InviteSuccessCode = 'invite/success'

type CreateOrgErrorCode = 'create-org/no-name'
type CreateOrgSuccessCode = 'create-org/success'

type RemoveUserErrorCode = 'remove-user/error'

export type FeedbackCode =
    | InviteErrorCode
    | InviteSuccessCode
    | ErrorCode
    | RemoveUserErrorCode
    | CreateOrgErrorCode
    | CreateOrgSuccessCode

export type FormValidationFeedback = {
    type: VariantType
    message: string
}

function getFormState(code: FeedbackCode): FormValidationFeedback {
    switch (code) {
        case 'invite/user-not-found':
            return {
                type: 'error',
                message: 'Fant ingen bruker med denne e-postadressen.',
            }
        case 'invite/already-invited':
            return {
                type: 'error',
                message: 'Brukeren er allerede medlem av organisasjonen',
            }
        case 'invite/success':
            return {
                type: 'success',
                message: 'Bruker lagt til!',
            }
        case 'auth/not-allowed':
            return {
                type: 'error',
                message: 'Ingen tilgang!',
            }
        case 'remove-user/error':
            return {
                type: 'error',
                message: 'Kunne ikke slette bruker',
            }
        case 'create-org/no-name':
            return {
                type: 'error',
                message: 'Du må sette et navn på organisasjonen',
            }
        case 'create-org/success':
            return {
                type: 'success',
                message: 'organisasjon opprettet!',
            }
        default:
            return {
                type: 'error',
                message: 'Noe gikk galt.',
            }
    }
}

export function getFormStateProps(code: FeedbackCode | undefined) {
    if (!code) return
    const status = getFormState(code)
    return {
        variant: status?.type,
        feedback: status?.message,
    }
}
