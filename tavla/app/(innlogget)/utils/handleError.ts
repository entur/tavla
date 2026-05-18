import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { getFormFeedbackForError } from './forms'

export function handleError(e: unknown) {
    if (e instanceof FirebaseError || isString(e)) {
        return getFormFeedbackForError(e)
    }
    return getFormFeedbackForError('general')
}
