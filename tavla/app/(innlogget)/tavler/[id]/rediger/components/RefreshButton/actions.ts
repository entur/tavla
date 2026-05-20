'use server'

import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import { redirect } from 'next/navigation'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import { getBackendUrl } from 'utils/backendUrl'

export async function refreshBoard(board: BoardDB) {
    await logToGcp('info', 'action:refreshBoard invoked', { bid: board.id })
    const access = await userCanEditBoard(board.id)
    if (!access) return redirect('/')

    const res = await fetch(`${getBackendUrl()}/refresh/${board.id}`, {
        method: 'POST',
        body: JSON.stringify(board),
        headers: {
            Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
    })
    await logToGcp(
        res.ok ? 'info' : 'warning',
        `POST /refresh/${board.id}: status=${res.status}`,
    )
    return res.ok
}
