import React from 'react'

import {
    Heading1,
    Heading2,
    Heading3,
    Paragraph,
    Link,
} from '@entur/typography'

import { Contrast } from '@entur/layout'

import './styles.scss'

const Privacy = (): JSX.Element => (
    <article className="privacy">
        <Contrast>
            <div className="privacy__header">
                <Heading1>Personvern</Heading1>
            </div>
        </Contrast>

        <div className="privacy__body">
            <Heading2>Tilganger</Heading2>
            <Paragraph>
                For at reiseplanleggeren skal fungere optimalt trenger den
                forskjellige tilganger til nettleseren din. Entur-appen kan be
                om følgende tilganger:
            </Paragraph>
            <Heading3>Din posisjon</Heading3>
            <Paragraph>
                For at søket med «Fra din posisjon» skal fungere, må Entur vite
                hvor du befinner deg. Denne tilgangen brukes også til å vise de
                nærmeste stoppestedene. Posisjonen finner vi ved hjelp av
                telefonens GPS-funksjon, WiFi-tilkoblinger, IP-adresser, RFID,
                Bluetooth, MAC-adresser og GSM/CDMA-celle-ID.
            </Paragraph>
            <Paragraph>
                Om vi vil vite hvor du er, spør vi om lov først. Du kan alltid
                regulere denne tilgangen i telefonens eller nettleserens
                innstillinger.
            </Paragraph>
            <Heading3>Nettverkskommunikasjon</Heading3>
            <Paragraph>
                For at vi skal kunne søke etter de beste reisene for deg,
                trenger du tilgang til internett. Dette får du enten via WiFi
                eller mobilt nettverk.
            </Paragraph>

            <Heading2>Autentisering</Heading2>
            <Paragraph>
                Vi bruker Firebase Authentication ved autentisering, og lagring
                av brukernavn og passord ved innlogging. Les mer om{' '}
                <Link href="https://firebase.google.com/docs/auth">
                    Firebase Auth
                </Link>{' '}
                samt mer om{' '}
                <Link href="https://firebase.google.com/support/privacy">
                    Firebase Privacy Policy.
                </Link>
            </Paragraph>

            <Heading2>Feilsøking</Heading2>
            <Paragraph>
                Vi bruker <Link href="https://sentry.io">Sentry</Link> til å
                logge kræsjrapporter når noe går galt på Tavla. Dette bruker vi
                til å enklere oppdage og rette feil som oppstår i koden.
            </Paragraph>
            <Paragraph>
                Feilrapportene vi mottar inneholder informasjon om hvilken
                nettleser og hvilket operativsystem du bruker. Vi lagrer ikke
                IP-adresser.
            </Paragraph>
        </div>
    </article>
)

export default Privacy
