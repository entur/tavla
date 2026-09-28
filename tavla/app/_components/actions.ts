'use server'

import * as Sentry from '@sentry/nextjs'
import { isEmptyOrSpaces } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { validEmail } from 'src/utils/email'
import { logToGcp } from 'src/utils/logging'

async function postForm(_prevState: TFormFeedback | undefined, data: FormData) {
    logToGcp('info', 'action invoked: postForm', {
        type: 'server-action',
        action: 'postForm',
    })
    const email = data.get('email') as string
    const message = data.get('message') as string
    const disabledEmail = data.get('disabledEmail') as string

    if (disabledEmail !== 'on' && !validEmail(email)) {
        return getFormFeedbackForError('auth/missing-email')
    }

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
        logToGcp('info', 'outgoing slack webhook request sent', {
            type: 'server-action',
            action: 'postForm',
        })
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        logToGcp(
            response.ok ? 'info' : 'error',
            'outgoing slack webhook response received',
            {
                type: 'server-action',
                action: 'postForm',
                status: response.status,
            },
        )

        if (!response.ok) {
            throw Error('Error in request')
        }
    } catch (error) {
        logToGcp('error', 'failed to submit contact form', {
            type: 'server-action',
            action: 'postForm',
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
            context: { formMessage: message },
        })
        Sentry.captureException(error, {
            extra: {
                message: 'Error while submitting contact form',
                formMessage: message,
            },
        })
        return handleError(error)
    }
}

export { postForm }
