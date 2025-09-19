'use server'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'
import { v4 as uuidv4 } from 'uuid'

export async function useHeartbeat(board: TBoard) {
    const tabId = uuidv4()

    const res = await fetch(`${getBackendUrl()}/heartbeat`, {
        method: 'POST',
        body: JSON.stringify({
            tid: tabId,
            bid: board.id,
            browser: 'tull',
            screen_width: 230,
            screen_height: 320,
        }),
        headers: {
            // Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
    })

    return res.ok

    // useEffect(() => {
    //     if (!boardId) return

    //     const tabId = uuidv4()

    //     const sendHeartbeat = async () => {
    //         try {
    //             await fetch(`${getBackendUrl()}/heartbeat`, {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     tid: tabId,
    //                     bid: boardId,
    //                     browser: 'tull',
    //                     screen_width: 230,
    //                     screen_height: 320,
    //                 }),
    //             })
    //         } catch (error) {
    //             console.error('Error sending heartbeat:', error)
    //         }
    //     }

    //     sendHeartbeat()

    //     const interval = setInterval(sendHeartbeat, 30_000)

    //     return () => clearInterval(interval)
    // }, [boardId])
}
