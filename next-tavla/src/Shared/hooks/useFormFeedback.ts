import { VariantType } from '@entur/form'
import { useState } from 'react'

type FormValidationError = 'invite/user-not-found' | 'invite/already-invited'
type FromValidationSuccess = 'invite/success'

type TFormValidationCode = FormValidationError | FromValidationSuccess

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

    const setFeedbackMessage = (type: TFormValidationCode) => {
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
