import { VariantType } from '@entur/form'
import { useState } from 'react'

type ErrorCode = 'error' | 'auth/not-allowed'
type InviteErrorCode = 'invite/user-not-found' | 'invite/already-invited'
type InviteSuccessCode = 'invite/success'
type DeleteErrorCode = 'delete/name-mismatch'

export type FeedbackCode =
    | InviteErrorCode
    | InviteSuccessCode
    | ErrorCode
    | DeleteErrorCode

type FormValidationFeedback = {
    type: VariantType
    message: string
} | null

export function useFormFeedback() {
    const [feedback, setFeedback] = useState<FormValidationFeedback>(null)

    const getTextFieldProps = () => {
        return {
            variant: feedback?.type,
            feedback: feedback?.message,
        }
    }

    const setFeedbackMessage = (type: FeedbackCode) => {
        switch (type) {
            case 'invite/user-not-found':
                return setFeedback({
                    type: 'error',
                    message: 'Fant ingen bruker med denne e-postadressen.',
                })
            case 'invite/already-invited':
                return setFeedback({
                    type: 'error',
                    message: 'Brukeren er allerede medlem av organisasjonen',
                })
            case 'invite/success':
                return setFeedback({
                    type: 'success',
                    message: 'Bruker lagt til!',
                })
            case 'delete/name-mismatch':
                return setFeedback({
                    type: 'error',
                    message: 'Navnet stemmer ikke overens med organisasjonen.',
                })
            case 'error':
                return setFeedback({
                    type: 'error',
                    message: 'Noe gikk galt.',
                })
            default:
                return setFeedback({
                    type: 'error',
                    message: 'Noe gikk galt.',
                })
        }
    }

    const clearFeedback = () => {
        setFeedback(null)
    }

    return {
        feedback,
        setFeedback: setFeedbackMessage,
        clearFeedback,
        getTextFieldProps,
    }
}
