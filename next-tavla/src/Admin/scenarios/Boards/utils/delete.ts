import { TavlaError } from 'Admin/types/error'
import { TBoardID } from 'types/settings'
async function deleteBoard(bid: TBoardID) {
    const response = await fetch('/api/board', {
        method: 'DELETE',
        body: JSON.stringify({ bid: bid }),
    })

    if (!response.ok) {
        throw new TavlaError({
            code: 'BOARD',
            message: 'Could not delete board',
        })
    }
}

export { deleteBoard }
