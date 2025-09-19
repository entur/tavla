import { uuid4 } from '@sentry/core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBackendUrl } from 'utils/index'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { tid, boardId } = req.body
    if (!boardId) {
        return res.status(400).json({ error: 'Missing boardId' })
    }

    const tabId = tid ?? uuid4()

    try {
        const backendRes = await fetch(`${getBackendUrl()}/heartbeat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            },
            body: JSON.stringify({
                tid: tabId,
                bid: boardId,
                browser: 'tull',
                screen_width: 230,
                screen_height: 320,
            }),
        })

        return res.status(backendRes.ok ? 200 : 500).json({ ok: backendRes.ok })
    } catch (err) {
        console.error('Error proxying heartbeat:', err)
        return res.status(500).json({ error: 'Heartbeat failed' })
    }
}
