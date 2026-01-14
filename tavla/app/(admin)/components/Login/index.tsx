'use client'
import { IconButton } from '@entur/button'
import { CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { logout } from './actions'
import { Create } from './Create'
import { Email } from './Email'
import { Reset } from './Reset'
import { TLoginPage } from './types'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const posthog = usePostHog()

    const { open, pageParam } = usePageParam('login')

    if (loggedIn)
        return (
            <IconButton
                onClick={async () => {
                    await logout()
                }}
                className="shrink-0 gap-2 md:!flex"
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
                className="shrink-0 gap-2"
                onClick={() => {
                    posthog.capture('LOG_IN_BTN')
                }}
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
