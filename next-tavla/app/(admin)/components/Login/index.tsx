'use client'
import Link from 'next/link'
import { Modal } from '@entur/modal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IconButton, SecondarySquareButton } from '@entur/button'
import { BackArrowIcon, CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { logout } from './actions'
import { TLoginPage } from 'Admin/types/login'
import { Email } from './Email'
import { Start } from './Start'
import { Create } from './Create'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const loginOpen = params?.has('login') ?? false
    const page = params?.get('login')
    const hasPage = page !== ''
    if (!loggedIn)
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
                open={loginOpen}
                size="small"
                onDismiss={() => router.push(pathname ?? '/')}
            >
                <div className="flexRow justifyBetween">
                    {hasPage && (
                        <SecondarySquareButton
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <BackArrowIcon />
                        </SecondarySquareButton>
                    )}

                    <SecondarySquareButton
                        as={Link}
                        href={pathname ?? '/'}
                        className="p-2 ml-auto"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                </div>
                <Page page={page as TLoginPage} />
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
        default:
            return <Start />
    }
}

export { Login }
