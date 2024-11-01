'use server'

import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { validEmail } from 'utils/email'
async function postForm(prevState: TFormFeedback | undefined, data: FormData) {
    const email = data.get('email') as string
    const message = data.get('message') as string

    if (!validEmail(email)) return getFormFeedbackForError('auth/missing-email')

    if (isEmptyOrSpaces(message))
        return getFormFeedbackForError('contact/message-missing')

    const timestamp = Math.floor(Date.now() / 1000)

    const payload = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: ':email: Ny melding :email:',
                    emoji: true,
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'rich_text',
                elements: [
                    {
                        type: 'rich_text_section',
                        elements: [
                            {
                                type: 'date',
                                timestamp: timestamp,
                                format: '{date_num} klokken {time}',
                                fallback: 'timey',
                            },
                        ],
                    },
                ],
            },
            {
                type: 'section',
                block_id: 'email',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Fra:* \n${email}`,
                    },
                ],
            },

            {
                type: 'rich_text',
                elements: [
                    {
                        type: 'rich_text_section',
                        elements: [
                            {
                                type: 'text',
                                text: 'Melding:',
                                style: {
                                    bold: true,
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'rich_text',
                elements: [
                    {
                        type: 'rich_text_section',
                        elements: [
                            {
                                type: 'text',
                                text: `${message}`,
                            },
                        ],
                    },
                ],
            },
        ],
    }

    try {
        const url = process.env.SLACK_WEBHOOK_URL
        if (!url) throw Error('Could not find url')
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw Error('Error in request')
        }
    } catch {
        return getFormFeedbackForError('general')
    }
}

export { postForm }
