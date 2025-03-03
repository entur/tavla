'use client'

import { TopNavigationItem } from '@entur/menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { CreateBoard } from './CreateBoard'

function HorizontalNavBar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    if (!loggedIn) return null
    return (
        <div className="flex-row hidden md:flex gap-4">
            <IconButton
                as={Link}
                href={{ query: { board: null } }}
                className="gap-4"
            >
                <AddIcon /> Opprett tavle
                <CreateBoard />
            </IconButton>
            <TopNavigationItem
                active={pathname?.includes('/boards')}
                as={Link}
                href="/boards"
                className="!text-primary"
            >
                Tavler
            </TopNavigationItem>
            <TopNavigationItem
                active={pathname?.includes('/folders')}
                as={Link}
                href="/folders"
                className="!text-primary"
            >
                Mapper
            </TopNavigationItem>
        </div>
    )
}

export { HorizontalNavBar }
