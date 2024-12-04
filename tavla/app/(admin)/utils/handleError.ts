/* eslint-disable no-console */
// TODO: switch console.log to Sentry.captureException
import { FirebaseError } from 'firebase/app'
import { getFormFeedbackForError } from '.'

export function handleError(e: unknown) {
    if (e instanceof FirebaseError) {
        console.error(e.message)
        return getFormFeedbackForError(e)
    } else if (e instanceof Error) {
        console.error(e.message)
    }
    return getFormFeedbackForError('general')
}
