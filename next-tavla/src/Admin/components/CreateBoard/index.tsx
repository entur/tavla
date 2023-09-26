import { PrimaryButton } from '@entur/button'
import { useState } from 'react'
import Link from 'next/link'
import { AddIcon } from '@entur/icons'

function CreateBoard() {
    const [loading, isLoading] = useState(false)
    return (
        <PrimaryButton
            as={Link}
            href="/api/board"
            replace
            onClick={() => isLoading(true)}
            disabled={loading}
            loading={loading}
        >
            <AddIcon />
            Opprett ny tavle
        </PrimaryButton>
    )
}
export { CreateBoard }
