import { useEffect, useState } from 'react'

function useLink(bid?: string) {
    const [link, setLink] = useState(bid)

    useEffect(() => {
        setLink(window.location.origin + '/' + bid)
    }, [bid])

    return link
}

export { useLink }
