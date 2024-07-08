'use client'
import Link from 'next/link'
import { Modal } from '@entur/modal'
import { usePathname, useRouter } from 'next/navigation'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { BackArrowIcon, CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { logout } from './actions'
import { Email } from './Email'
import { Start } from './Start'
import { Create } from './Create'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { Reset } from './Reset'
import { TopNavigationItem } from '@entur/menu'

type TLoginPage = 'start' | 'email' | 'create' | 'reset'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()

    const { open, hasPage, pageParam } = usePageParam('login')

    if (loggedIn)
        return (
            <IconButton
                onClick={async () => {
                    await logout()
                }}
                className="gap-4 p-4 hidden md:flex"
            >
                <LogOutIcon />
                Logg ut
            </IconButton>
        )

    return (
        <div className="flex flex-row gap-10">
            <TopNavigationItem
                active={pathname?.includes('/demo')}
                as={Link}
                href="/demo"
            >
                Prøv Tavla
            </TopNavigationItem>
            <IconButton
                as={Link}
                href="?login"
                scroll={false}
                className="gap-4 p-4"
            >
                <UserIcon />
                Logg inn
            </IconButton>
            <Modal
                open={open}
                size="small"
                className="w-11/12 lg:w-full"
                onDismiss={() => router.push(pathname ?? '/')}
            >
                <div className="flex flex-row justify-between">
                    {hasPage && (
                        <SecondarySquareButton
                            onClick={() => router.back()}
                            aria-label="Tilbake til logg inn"
                        >
                            <BackArrowIcon />
                        </SecondarySquareButton>
                    )}

                    <SecondarySquareButton
                        as={Link}
                        href={pathname ?? '/'}
                        className="ml-auto"
                        aria-label="Lukk vindu"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                </div>
                <Page page={pageParam as TLoginPage} />
            </Modal>
        </div>
    )
}

function Page({ page }: { page: TLoginPage }) {
    switch (page) {
        case 'email':
            return <Email />
        case 'create':
            return <Create />
        case 'reset':
            return <Reset />
        default:
            return <Start />
    }
}

export { Login }
