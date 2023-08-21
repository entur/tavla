import {
    PrimaryButton,
    SecondaryButton,
    SecondarySquareButton,
} from '@entur/button'
import Image from 'next/image'
import { BackArrowIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { SyntheticEvent, useState } from 'react'
import classes from './styles.module.css'
import musk from 'assets/illustrations/Musk.png'
import { TextField } from '@entur/form'
import { FirebaseError } from '@firebase/util'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { useAuth } from 'Admin/hooks/useAuth'

type TLoginPage = 'start' | 'email' | 'create'

function Login({ user }: { user: DecodedIdToken | null; documentId: string }) {
    const { logout } = useAuth()

    const [isOpen, setIsOpen] = useState(false)
    const [pages, setPages] = useState<TLoginPage[]>([])

    const pushPage = (page: TLoginPage) => {
        setPages([...pages, page])
    }

    const popPage = () => {
        setPages(pages.slice(0, -1))
    }

    return (
        <>
            {user ? (
                <PrimaryButton onClick={logout}>Logg ut</PrimaryButton>
            ) : (
                <PrimaryButton onClick={() => setIsOpen(true)}>
                    Logg inn
                </PrimaryButton>
            )}
            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => setIsOpen(false)}
                closeLabel="Lukk innlogging"
                className={classes.login}
            >
                <div className={classes.actions}>
                    <SecondarySquareButton
                        onClick={() => setIsOpen(false)}
                        aria-label="Lukk innlogging"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                    {pages && pages.length > 0 && (
                        <SecondarySquareButton
                            onClick={popPage}
                            aria-label="Gå tilbake"
                        >
                            <BackArrowIcon />
                        </SecondarySquareButton>
                    )}
                </div>
                <Page pages={pages} pushPage={pushPage} />
            </Modal>
        </>
    )
}

function Page({
    pages,
    pushPage,
}: {
    pages: TLoginPage[]
    pushPage: (page: TLoginPage) => void
}) {
    if (!pages) return <Start pushPage={pushPage} />

    const lastPage = pages.slice(-1)[0]

    switch (lastPage) {
        case 'email':
            return <Email />
        case 'create':
            return <CreateUser />
        default:
            return <Start pushPage={pushPage} />
    }
}

function Start({ pushPage }: { pushPage: (page: TLoginPage) => void }) {
    return (
        <div>
            <Image src={musk} alt="illustration" className={classes.image} />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn">
                <PrimaryButton onClick={() => pushPage('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton onClick={() => pushPage('create')}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

function Email() {
    const [error, setError] = useState<string>()
    const { login } = useAuth()
    return (
        <div>
            <Image src={musk} alt="illustration" className={classes.image} />
            <Heading3>Logg inn med e-post</Heading3>
            <form
                className="flexColumn"
                onSubmit={async (event: SyntheticEvent) => {
                    event.preventDefault()

                    const data = event.currentTarget as unknown as {
                        email: HTMLInputElement
                        password: HTMLInputElement
                    }

                    const email = data.email.value
                    const password = data.password.value

                    try {
                        await login(email, password)
                    } catch (error: unknown) {
                        if (error instanceof FirebaseError) setError(error.code)
                    }
                }}
            >
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />
                <SubParagraph>{error}</SubParagraph>
                <PrimaryButton type="submit">Logg inn</PrimaryButton>
            </form>
        </div>
    )
}

function CreateUser() {
    const { createUser } = useAuth()

    return (
        <div>
            <Image src={musk} alt="illustration" className={classes.image} />
            <Heading3>Logg inn med e-post</Heading3>
            <form
                className="flexColumn"
                onSubmit={async (event: SyntheticEvent) => {
                    event.preventDefault()

                    const data = event.currentTarget as unknown as {
                        email: HTMLInputElement
                        password: HTMLInputElement
                        repeat_password: HTMLInputElement
                    }

                    const email = data.email.value
                    const password = data.password.value
                    const repeatPassword = data.repeat_password.value

                    await createUser(email, password, repeatPassword)
                }}
            >
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
