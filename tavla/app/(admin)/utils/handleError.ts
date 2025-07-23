import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { getFormFeedbackForError } from '.'

export function handleError(e: unknown) {
    if (e instanceof FirebaseError || isString(e)) {
        return getFormFeedbackForError(e)
    }
    return getFormFeedbackForError('general')
}
