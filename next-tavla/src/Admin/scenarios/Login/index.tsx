import {
    PrimaryButton,
    SecondaryButton,
    SecondarySquareButton,
} from '@entur/button'
import Image from 'next/image'
import { BackArrowIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { useState } from 'react'
import classes from './styles.module.css'
import musk from 'assets/illustrations/Musk.png'

function Login() {
    const [isOpen, setIsOpen] = useState(false)
    const [pages, setPages] = useState<string[]>([])

    const pushPage = (page: string) => {
        setPages([...pages, page])
    }

    const popPage = () => {
        setPages(pages.slice(0, -1))
    }

    return (
        <>
            <PrimaryButton onClick={() => setIsOpen(true)}>
                Logg inn
            </PrimaryButton>
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
    pages: string[]
    pushPage: (page: string) => void
}) {
    if (!pages) return <Start pushPage={pushPage} />

    switch (pages.slice(-1)[0]) {
        case 'email':
            return <Email />
        default:
            return <Start pushPage={pushPage} />
    }
}

function Start({ pushPage }: { pushPage: (page: string) => void }) {
    return (
        <div>
            <div className={classes.imageContainer}>
                <Image
                    src={musk}
                    alt="illustration"
                    className={classes.image}
                />
            </div>
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn">
                <PrimaryButton onClick={() => pushPage('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton>Opprett ny bruker</SecondaryButton>
            </div>
        </div>
    )
}

function Email() {
    return <Heading3>E-post innlogging</Heading3>
}

export { Login }
