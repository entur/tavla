'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { isString, uniq } from 'lodash'
import { revalidatePath } from 'next/cache'
import { hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { TBoardID } from 'types/settings'
import { firestore } from 'firebase-admin'
import { TTag } from 'types/meta'

async function fetchTags({ bid }: { bid: TBoardID }) {
    const board = await firestore().collection('boards').doc(bid).get()
    if (!board.exists) throw 'board/not-found'

    const access = await hasBoardEditorAccess(board.id)
    if (!access) throw 'auth/operation-not-allowed'

    return (board.data()?.meta?.tags as TTag[]) ?? []
}

export async function removeTag(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as string
    const tag = data.get('tag') as string

    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'

    try {
        const tags = await fetchTags({ bid })
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.tags': tags.filter((t) => t !== tag) })
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}

export async function addTag(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as string
    const tag = data.get('tag') as string

    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'

    try {
        const tags = await fetchTags({ bid })

        if (tags.map((t) => t.toUpperCase()).includes(tag.toUpperCase()))
            throw 'boards/tag-exists'

        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.tags': uniq([...tags, tag]).sort() })
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}
