'use server'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoard } from 'types/settings'

initializeAdminApp()

export async function setViewType(board: TBoard, viewType: string) {
    const access = await userCanEditBoard(board.id)
    if (!access) return redirect('/')

    const shouldDeleteCombinedTiles = viewType === 'separate'

    try {
        await firestore()
            .collection('boards')
            .doc(board.id ?? '')
            .update({
                combinedTiles: shouldDeleteCombinedTiles
                    ? firestore.FieldValue.delete()
                    : [{ ids: board.tiles.map((tile) => tile.uuid) }],
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${board.id}`)
    } catch (e) {
        handleError(e)
    }
}
