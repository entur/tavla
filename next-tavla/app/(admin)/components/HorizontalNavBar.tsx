import { TopNavigationItem } from '@entur/menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CreateBoard } from './CreateBoard'
import { Login } from './Login'

function HorizontalNavBar({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    return (
        <>
            {loggedIn && (
                <>
                    <CreateBoard />
                    <TopNavigationItem
                        active={pathname?.includes('/boards')}
                        as={Link}
                        href="/boards"
                    >
                        Tavler
                    </TopNavigationItem>
                    <TopNavigationItem
                        active={pathname?.includes('/organizations')}
                        as={Link}
                        href="/organizations"
                    >
                        Organisasjoner
                    </TopNavigationItem>
                </>
            )}
            <Login loggedIn={loggedIn} />
        </>
    )
}

export { HorizontalNavBar }
