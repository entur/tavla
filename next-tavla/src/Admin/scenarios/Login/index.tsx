import {
    PrimaryButton,
    SecondaryButton,
    SecondarySquareButton,
} from '@entur/button'
import Image from 'next/image'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { useState } from 'react'
import classes from './styles.module.css'
import musk from 'assets/illustrations/Musk.png'

function Login() {
    const [isOpen, setIsOpen] = useState(false)

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
                <div className={classes.close}>
                    <SecondarySquareButton
                        onClick={() => setIsOpen(false)}
                        aria-label="Lukk innlogging"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                </div>
                <div className={classes.imageContainer}>
                    <Image
                        src={musk}
                        alt="illustration"
                        className={classes.image}
                    />
                </div>
                <Heading3>Logg inn for å fortsette</Heading3>
                <Paragraph>
                    Logg inn for å få tilgang til å opprette og administrere
                    tavler.
                </Paragraph>
                <div className="flexColumn">
                    <PrimaryButton>Logg inn med e-post</PrimaryButton>
                    <SecondaryButton>Opprett ny bruker</SecondaryButton>
                </div>
            </Modal>
        </>
    )
}

export { Login }
