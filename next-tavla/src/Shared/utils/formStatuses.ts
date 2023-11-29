import { VariantType } from '@entur/form'

type ErrorCode = 'error' | 'auth/not-allowed'

type InviteErrorCode = 'invite/user-not-found' | 'invite/already-invited'
type InviteSuccessCode = 'invite/success'

type RemoveUserErrorCode = 'remove-user/error'

export type FeedbackCode =
    | InviteErrorCode
    | InviteSuccessCode
    | ErrorCode
    | RemoveUserErrorCode

export type FormValidationFeedback = {
    type: VariantType
    message: string
} | null

const FORM_STATUSES: Record<FeedbackCode, FormValidationFeedback> = {
    'invite/user-not-found': {
        type: 'error',
        message: 'Fant ingen bruker med denne e-postadressen.',
    },
    'invite/already-invited': {
        type: 'error',
        message: 'Brukeren er allerede medlem av organisasjonen',
    },
    'invite/success': {
        type: 'success',
        message: 'Bruker lagt til!',
    },
    'auth/not-allowed': {
        type: 'error',
        message: 'Ingen tilgang!',
    },
    'remove-user/error': {
        type: 'error',
        message: 'Kunne ikke slette bruker',
    },
    error: {
        type: 'error',
        message: 'Noe gikk galt.',
    },
}

function getFormStatus(code: FeedbackCode) {
    return FORM_STATUSES[code] ?? FORM_STATUSES.error
}

export function getFormStatusProps(code: FeedbackCode | null) {
    if (!code) return {}
    const status = getFormStatus(code)
    return {
        variant: status?.type,
        feedback: status?.message,
    }
}
