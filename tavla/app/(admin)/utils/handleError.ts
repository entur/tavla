import { FirebaseError } from 'firebase/app'
import { getFormFeedbackForError } from '.'
import { isString } from 'lodash'

export function handleError(e: unknown) {
    if (e instanceof FirebaseError || isString(e)) {
        return getFormFeedbackForError(e)
    }
    return getFormFeedbackForError('general')
}
