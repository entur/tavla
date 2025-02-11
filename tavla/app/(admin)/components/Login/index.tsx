'use client'
import Link from 'next/link'
import { Modal } from '@entur/modal'
import { usePathname, useRouter } from 'next/navigation'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { BackArrowIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { logout } from './actions'
import { Create } from './Create'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { Reset } from './Reset'
import { usePostHog } from 'posthog-js/react'
import { TLoginPage } from './types'
import { Email } from './Email'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const posthog = usePostHog()

    const { open, hasPage, pageParam } = usePageParam('login')

    if (loggedIn)
        return (
            <IconButton
                onClick={async () => {
                    await logout()
                }}
                className="gap-4 !hidden md:!flex"
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
                onClick={() => {
                    posthog.capture('LOGIN_BTN_NAV_BAR')
                }}
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
