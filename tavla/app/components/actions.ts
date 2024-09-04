'use server'

import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'

async function postForm(prevState: TFormFeedback | undefined, data: FormData) {
    const email = data.get('email') as string
    const message = data.get('message') as string

    if (!email) {
        return getFormFeedbackForError('auth/missing-email')
    }
    if (!message) {
        return getFormFeedbackForError('contact/message-missing')
    }
    const payload = {
        text: `:email: *Ny melding* :email:\n\n*E-postadresse:* ${email}\n*Melding:* ${message}`,
    }
    const url = process.env.SLACK_WEBHOOK_URL ?? ''
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        return getFormFeedbackForError('general')
    }
}

export { postForm }
