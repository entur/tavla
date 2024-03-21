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

type TLoginPage = 'start' | 'email' | 'create' | 'reset'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()

    const { open, hasPage, pageParam } = usePageParam('login')

    if (loggedIn)
        return (
            <form action={logout}>
                <IconButton type="submit" className="g-2 p-2">
                    <LogOutIcon />
                    Logg ut
                </IconButton>
            </form>
        )

    return (
        <>
            <IconButton
                as={Link}
                href="?login"
                scroll={false}
                className="g-2 p-2"
            >
                <UserIcon />
                Logg inn
            </IconButton>
            <Modal
                open={open}
                size="small"
                onDismiss={() => router.push(pathname ?? '/')}
            >
                <div className="flexRow justifyBetween">
                    {hasPage && (
                        <SecondarySquareButton
                            onClick={() => router.back()}
                            aria-label="tilbake til logg inn"
                        >
                            <BackArrowIcon />
                        </SecondarySquareButton>
                    )}

                    <SecondarySquareButton
                        as={Link}
                        href={pathname ?? '/'}
                        className="ml-auto"
                        aria-label="lukk vindu"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                </div>
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
            return <Start />
    }
}

export { Login }
