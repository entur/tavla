'use client'
import { useCallback, useEffect } from 'react'
import { TBoardID } from 'types/settings'

function Pinger({ boardId }: { boardId?: TBoardID }) {
    const updateLastActive = useCallback(async () => {
        await fetch(`/api/ping/${boardId}`, {
            method: 'POST',
        })
    }, [boardId])

    useEffect(() => {
        updateLastActive()
        const intervalId = setInterval(updateLastActive, 1000 * 60 * 60 * 24)
        return () => {
            clearInterval(intervalId)
        }
    }, [updateLastActive])

    return <div hidden aria-hidden />
}

export { Pinger }
