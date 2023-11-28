'use client'
import Link from 'next/link'
import { Modal } from '@entur/modal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import { Heading3, Paragraph } from '@entur/typography'
import {
    PrimaryButton,
    SecondaryButton,
    IconButton,
    SecondarySquareButton,
} from '@entur/button'
import { useLoginPath } from './useLoginPath'
import { BackArrowIcon, CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { login, logout } from './actions'
import { TextField } from '@entur/form'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const loginOpen = params?.has('login') ?? false
    const page = params?.get('login')
    const hasPage = page !== ''
    console.log(page)
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
                {page === 'email' ? <Email /> : <Start />}
            </Modal>
        </>
    )
}

function Start() {
    const getPath = useLoginPath()
    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn g-2 w-100">
                <PrimaryButton as={Link} href={getPath('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton as={Link} href={getPath('create')}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

function Email() {
    const getPath = useLoginPath()
    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn w-100 g-2" action={login}>
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />

                <PrimaryButton type="submit">Logg inn</PrimaryButton>
                <SecondaryButton as={Link} href={getPath('reset')}>
                    Glemt passord?
                </SecondaryButton>
            </form>
        </div>
    )
}

export { Login }
