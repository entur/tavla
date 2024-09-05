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
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: ':email: Ny Melding :email:',
                    emoji: true,
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'section',
                block_id: 'email_info',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Fra:* \n${email}`,
                    },
                ],
            },
            {
                type: 'section',
                block_id: 'email_body',
                text: {
                    type: 'mrkdwn',
                    text: `*Melding:* \n${message}`,
                },
            },
            {
                type: 'divider',
            },
        ],
    }

    try {
        const url = process.env.SLACK_WEBHOOK_URL
        if (!url) throw Error()
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw Error()
        }
    } catch (e: unknown) {
        return getFormFeedbackForError('general')
    }
}

export { postForm }
