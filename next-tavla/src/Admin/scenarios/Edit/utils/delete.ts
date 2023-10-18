import { TavlaError } from 'Admin/types/error'
import { TBoardID } from 'types/settings'

export async function deleteBoardRequest(bid: TBoardID) {
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
