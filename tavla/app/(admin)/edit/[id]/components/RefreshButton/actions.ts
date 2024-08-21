'use server'

import { hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'

export async function refreshBoard(board: TBoard) {
    const access = await hasBoardEditorAccess(board.id)
    if (!access) return redirect('/')

    const res = await fetch(`${getBackendUrl()}/refresh/${board.id}`, {
        method: 'POST',
        body: JSON.stringify(board),
        headers: {
            Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
    })
    return res.ok
}
