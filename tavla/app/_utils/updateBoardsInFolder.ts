import { getFolder } from 'src/firebase'
import type { FolderDB } from 'types/db-types/folders'
import { getBackendUrl } from 'utils/backendUrl'
import { logToGcp } from 'utils/logging'

export async function updateBoardsInFolder(folderId: FolderDB['id']) {
    const folder = await getFolder(folderId)
    const boardIds = folder?.boards ?? []

    await Promise.allSettled(
        boardIds.map(async (bid) => {
            try {
                const res = await fetch(
                    `${getBackendUrl()}/update/${encodeURIComponent(bid)}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
                        },
                    },
                )
                logToGcp(res.ok ? 'info' : 'warning', 'update signal sent', {
                    type: 'http',
                    method: 'POST',
                    path: '/update/:bid',
                    status: res.status,
                    bid,
                    folderId,
                })
            } catch (error) {
                logToGcp('error', 'update signal failed', {
                    type: 'http',
                    method: 'POST',
                    path: '/update/:bid',
                    bid,
                    folderId,
                    errorName: error instanceof Error ? error.name : undefined,
                    errorMessage:
                        error instanceof Error ? error.message : String(error),
                })
            }
        }),
    )
}
