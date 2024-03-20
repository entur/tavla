import { useCallback, useEffect } from 'react'
import { TBoardID } from 'types/settings'

function useRefresh(bid?: TBoardID) {
    const poll = useCallback(() => {
        if (!bid) return
        fetch(`http://localhost:3001/${bid}`)
            .then(() => {
                location.reload()
                poll()
            })
            .catch(() => {
                location.reload()
                setTimeout(poll, 10000)
            })
    }, [bid])

    useEffect(() => {
        const timeout = setTimeout(poll, 10000)
        return () => clearTimeout(timeout)
    }, [poll])
}

export { useRefresh }
