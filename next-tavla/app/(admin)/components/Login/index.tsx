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
import { logout } from './logout'

function Login({ loggedIn }: { loggedIn: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const loginOpen = params?.has('login') ?? false
    const hasPage = params?.get('login') !== ''

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
                <Start />
            </Modal>
        </>
    )
}

function Start() {
    const router = useRouter()
    const getPath = useLoginPath()
    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn g-2 w-100">
                <PrimaryButton onClick={() => router.push(getPath('email'))}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton onClick={() => router.push(getPath('create'))}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

export { Login }
