/* eslint-disable no-console */
// TODO: Use a better logger than console
import { FirebaseError } from 'firebase/app'
import { getFormFeedbackForError } from '.'

export function handleError(e: unknown) {
    if (e instanceof FirebaseError) {
        console.error(e.message)
        return getFormFeedbackForError(e)
    } else if (e instanceof Error) {
        console.error(e.message)
        return getFormFeedbackForError('general')
    }
    return getFormFeedbackForError('unknown')
}
