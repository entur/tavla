'use server'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import { createBoard } from 'src/firebase'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function createDraftBoard(): Promise<string> {
    logToGcp('info', 'action invoked: createDraftBoard', {
        type: 'server-action',
        action: 'createDraftBoard',
    })
    const doc = await createBoard({
        meta: { title: 'Min tavle' },
        tiles: [],
        isCombinedTiles: false,
        isAnonymousBoard: true,
        isDraft: true,
    })
    return doc.id
}
