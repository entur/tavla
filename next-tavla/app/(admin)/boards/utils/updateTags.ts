'use server'
import { hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { uniq } from 'lodash'
import { TTag } from 'types/meta'
import { TBoardID } from 'types/settings'

async function fetchTags({ bid }: { bid: TBoardID }) {
    const board = await firestore().collection('boards').doc(bid).get()
    if (!board.exists) throw 'board/not-found'

    const access = await hasBoardEditorAccess(board.id)
    if (!access) throw 'auth/operation-not-allowed'

    return (board.data()?.meta?.tags as TTag[]) ?? []
}

export async function removeTag({ bid, tag }: { bid: TBoardID; tag: TTag }) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'

    const tags = await fetchTags({ bid })
    firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.tags': tags.filter((t) => t !== tag) })
}

export async function addTag({ bid, tag }: { bid: TBoardID; tag: TTag }) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) throw 'auth/operation-not-allowed'

    const tags = await fetchTags({ bid })
    if (tags.includes(tag)) throw 'boards/tag-exists'
    firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.tags': uniq([...tags, tag]).sort() })
}
