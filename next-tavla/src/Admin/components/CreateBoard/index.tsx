import { PrimaryButton } from '@entur/button'
import { useState } from 'react'
import Link from 'next/link'
import { AddIcon } from '@entur/icons'

function CreateBoard({ loggedIn }: { loggedIn?: boolean }) {
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
            {loggedIn ? 'Opprett ny tavle' : 'Logg inn for å opprette en tavle'}
        </PrimaryButton>
    )
}
export { CreateBoard }
