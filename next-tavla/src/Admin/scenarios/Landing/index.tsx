import { Button } from '@entur/button'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { addBoardSettings } from 'utils/firebase'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Landing() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleCreateNewBoard() {
        setLoading(true)
        const createdBoard = await addBoardSettings({ tiles: [] })
        await router.push('/admin/' + createdBoard.id)
    }

    return (
        <div className={classes.container}>
            <Heading1 className={classes.header}>Entur Tavla</Heading1>
            <Heading2 className={classes.header}>
                Her kan du lage din egen tavle
            </Heading2>

            <Button
                className={classes.createButton}
                onClick={handleCreateNewBoard}
                variant="primary"
                disabled={loading}
                loading={loading}
            >
                Opprett ny tavle
            </Button>
        </div>
    )
}

export { Landing }
