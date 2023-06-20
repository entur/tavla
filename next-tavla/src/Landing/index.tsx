import { Button } from '@entur/button'
import { Heading1, Heading3 } from '@entur/typography'
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
        setLoading(false)
    }

    return (
        <div className={classes.container}>
            <Heading1 className={classes.header}>EnTur Tavla</Heading1>
            <Heading3 className={classes.header}>
                Her kan du lage din egen tavle
            </Heading3>
            <Button
                className={classes.createButton}
                onClick={handleCreateNewBoard}
                variant="primary"
                width="auto"
                disabled={loading}
                loading={loading}
            >
                Opprett ny tavle
            </Button>
        </div>
    )
}

export default Landing
