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
import { BackArrowIcon, CloseIcon, LogOutIcon, UserIcon } from '@entur/icons'
import { login, logout, create } from './actions'
import { TextField } from '@entur/form'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'

import { auth } from 'utils/firebase'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { TLoginPage } from 'Admin/types/login'
import { revalidatePath } from 'next/cache'

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

function Start() {
    const getPathWithParams = useSearchParamsSetter('login')
    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn g-2 w-100">
                <PrimaryButton as={Link} href={getPathWithParams('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton as={Link} href={getPathWithParams('create')}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

function Email() {
    const getPathWithParams = useSearchParamsSetter('login')

    const submit = async (data: FormData) => {
        const email = data.get('email')?.toString()
        const password = data.get('password')?.toString()

        if (!email || !password) return

        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            await login(uid)
            revalidatePath('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn w-100 g-2" action={submit}>
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />

                <PrimaryButton type="submit">Logg inn</PrimaryButton>
                <SecondaryButton as={Link} href={getPathWithParams('reset')}>
                    Glemt passord?
                </SecondaryButton>
            </form>
        </div>
    )
}

function Create() {
    const submit = async (data: FormData) => {
        const email = data.get('email')?.toString()
        const password = data.get('password')?.toString()

        if (!email || !password) return

        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            await create(uid)
            await login(uid)
            revalidatePath('/')
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div>
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn g-2" action={submit}>
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />
                <TextField
                    name="repeat_password"
                    label="Gjenta passord"
                    type="password"
                />
                <PrimaryButton type="submit">Opprett ny bruker</PrimaryButton>
            </form>
        </div>
    )
}

export { Login }
