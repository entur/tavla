import { Button } from '@entur/button'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { addBoardSettings } from 'utils/firebase'

function CreateBoard() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    async function handleCreateNewBoard() {
        setLoading(true)
        const createdBoard = await addBoardSettings({
            tiles: [],
        })
        await router.push('/edit/' + createdBoard.id)
    }
    return (
        <Button
            onClick={handleCreateNewBoard}
            variant="primary"
            disabled={loading}
            loading={loading}
            width="fluid"
            aria-label="Opprett ny tavle"
        >
            Opprett ny tavle
        </Button>
    )
}

export { CreateBoard }
