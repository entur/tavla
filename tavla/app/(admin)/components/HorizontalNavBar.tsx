'use client'
import { TopNavigationItem } from '@entur/menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function HorizontalNavBar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    if (!loggedIn) return null
    return (
        <div className="flex-row hidden md:flex gap-4">
            <TopNavigationItem
                active={pathname?.includes('/boards')}
                as={Link}
                href="/boards"
                className="!text-primary"
            >
                Mapper og tavler
            </TopNavigationItem>
        </div>
    )
}

export { HorizontalNavBar }
