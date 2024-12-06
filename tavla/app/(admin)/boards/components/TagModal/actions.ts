'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { uniq } from 'lodash'
import { revalidatePath } from 'next/cache'
import { hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { TBoardID } from 'types/settings'
import { firestore } from 'firebase-admin'
import { TTag } from 'types/meta'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { notFound } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { handleError } from 'app/(admin)/utils/handleError'

async function fetchTags({ bid }: { bid: TBoardID }) {
    const board = await getBoard(bid)
    if (!board) {
        return notFound()
    }

    const access = await hasBoardEditorAccess(board.id)
    if (!access) throw 'auth/operation-not-allowed'

    return (board?.meta?.tags as TTag[]) ?? []
}

export async function removeTag(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as string
    const tag = data.get('tag') as string

    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'
    const tags = await fetchTags({ bid })

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.tags': tags.filter((t) => t !== tag) })
        revalidatePath('/')
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing tag from firestore',
                boardID: bid,
                tagValue: tag,
            },
        })
        return handleError(error)
    }
}

export async function addTag(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as string
    const tag = data.get('tag') as string

    if (isEmptyOrSpaces(tag))
        return getFormFeedbackForError('tags/name-missing')

    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'

    const tags = await fetchTags({ bid })

    try {
        if (tags.map((t) => t.toUpperCase()).includes(tag.toUpperCase()))
            throw 'boards/tag-exists'

        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.tags': uniq([...tags, tag]).sort() })
        revalidatePath('/')
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while adding new tag to firestore',
                boardID: bid,
                tagValue: tag,
            },
        })
        return handleError(error)
    }
}
