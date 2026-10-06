'use server'

import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import { redirect } from 'next/navigation'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import { getBackendUrl } from 'utils/backendUrl'

// Kopi av refreshBoard fra tavla/app/(innlogget)/tavler/[id]/rediger/actions.ts, men med revalidatePath som peker til /rediger-beta i stedet for /rediger.
export async function refreshBoard(board: BoardDB) {
    logToGcp('info', 'action invoked: refreshBoard', {
        type: 'server-action',
        action: 'refreshBoard',
        bid: board.id,
    })
    const access = await userCanEditBoard(board.id)
    if (!access) return redirect('/')

    const res = await fetch(
        `${getBackendUrl()}/refresh/${encodeURIComponent(board.id)}`,
        {
            method: 'POST',
            body: JSON.stringify(board),
            headers: {
                Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
        },
    )
    logToGcp(res.ok ? 'info' : 'warning', 'refresh signal sent', {
        type: 'http',
        method: 'POST',
        path: '/refresh/:bid',
        status: res.status,
        bid: board.id,
    })
    return res.ok
}
