import { getFolder } from 'src/firebase'
import type { FolderDB } from 'types/db-types/folders'
import { getBackendUrl } from 'utils/backendUrl'

export async function updateBoardsInFolder(folderID: FolderDB['id']) {
    const folder = await getFolder(folderID)
    const boardIds = folder?.boards ?? []

    const results = await Promise.allSettled(
        boardIds.map((bid) =>
            fetch(`${getBackendUrl()}/update/${encodeURIComponent(bid)}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
                },
            }),
        ),
    )

    const failed = results.filter(
        (r) => r.status === 'rejected' || !r.value.ok,
    ).length
}
