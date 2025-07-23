'use client'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { BackArrowIcon, CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from './actions'
import { Create } from './Create'
import { Email } from './Email'
import { Reset } from './Reset'
import { TLoginPage } from './types'

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
                className="!hidden gap-4 md:!flex"
            >
                <LogOutIcon />
                Logg ut
            </IconButton>
        )

    return (
        <>
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
                closeLabel='"Avbryt"'
                className="w-11/12 lg:w-full"
                onDismiss={() => router.push(pathname ?? '/')}
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => router.push(pathname ?? '/')}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                {hasPage && (
                    <SecondarySquareButton
                        onClick={() => router.back()}
                        aria-label="Tilbake til logg inn"
                    >
                        <BackArrowIcon />
                    </SecondarySquareButton>
                )}
                <Page page={pageParam as TLoginPage} />
            </Modal>
        </>
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
            return <Email />
    }
}

export { Login }
