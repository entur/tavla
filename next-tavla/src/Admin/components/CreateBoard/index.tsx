import { Button } from '@entur/button'
import { useState } from 'react'
import Link from 'next/link'
import { AddIcon } from '@entur/icons'

function CreateBoard() {
    const [loading, isLoading] = useState(false)
    return (
        <Button
            as={Link}
            href="/api/board"
            replace
            onClick={() => isLoading(true)}
            variant="primary"
            disabled={loading}
            loading={loading}
        >
            Opprett ny tavle
        </Button>
            {icon && <AddIcon />}
    )
}
export { CreateBoard }
