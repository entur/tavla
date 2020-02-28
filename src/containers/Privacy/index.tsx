import React from 'react'
import { Heading1, Heading2, Heading3, Paragraph } from '@entur/typography'

import BackButton from '../../components/backButton/BackButton'

import './styles.scss'

const Privacy = ({ history }: Props): JSX.Element => {
    const goBackToDashboard = (): void => {
        history.push(window.location.pathname.replace('privacy', ''))
    }

    return (
        <article className="privacy">
            <div className="privacy__header">
                <BackButton
                    size="medium"
                    className="privacy__header__back-button"
                    action={goBackToDashboard}
                />

                <Heading1>Personvern</Heading1>
            </div>

            <div className="privacy__body">
                <Heading2>Analyseverktøy</Heading2>
                <Paragraph>
                    Entur bruker analyseverktøyene Google Analytics og Firebase
                    for å samle info om hvordan du bruker tjenesten, ved hjelp
                    av informasjonskapsler. Som behandlingsansvarlig for
                    Entur-appen er det Entur AS som bestemmer hvilke
                    opplysninger Google Analytics kan innhente om bruken av våre
                    tjenester.
                </Paragraph>
                <Paragraph>
                    Analyseverktøyet kan anslå din omtrentlige geografiske
                    plassering, men adressen kan ikke brukes til å identifisere
                    deg.
                </Paragraph>
                <Paragraph>
                    Google Analytics mottar generell web- og appstatistikk, som
                    for eksempel tidspunkt, språk og generell informasjon om din
                    mobilenhet. Hendelser rundt reisesøk, kjøp og billettering
                    logges anonymt til bruk for å forbedre tjenesten. Ingenting
                    av dette kan spores tilbake til enkeltbrukere.
                </Paragraph>
                <Paragraph>
                    Vi benytter to informasjonskapsler av typen _ga, én av typen
                    _gat samt én _gid. Varighet og nærmere beskrivelse av disse
                    finnes{' '}
                    <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        her
                    </a>
                    .
                </Paragraph>

                <Heading2>Tilganger</Heading2>
                <Paragraph>
                    For at reiseplanleggeren skal fungere optimalt trenger den
                    forskjellige tilganger til telefonen din. Entur-appen kan be
                    om følgende tilganger:
                </Paragraph>
                <Heading3>Din posisjon</Heading3>
                <Paragraph>
                    For at søket med «Fra din posisjon» skal fungere, må Entur
                    vite hvor du befinner deg. Denne tilgangen brukes også til å
                    vise de nærmeste stoppestedene. Posisjonen finner vi ved
                    hjelp av telefonens GPS-funksjon, WiFi-tilkoblinger,
                    IP-adresser, RFID, Bluetooth, MAC-adresser og
                    GSM/CDMA-celle-ID.
                </Paragraph>
                <Paragraph>
                    Om vi vil vite hvor du er, spør vi om lov først. Du kan
                    alltid regulere denne tilgangen i telefonens eller
                    nettleserens innstillinger.
                </Paragraph>
                <Heading3>Nettverkskommunikasjon</Heading3>
                <Paragraph>
                    For at vi skal kunne søke etter de beste reisene for deg,
                    trenger du tilgang til internett. Dette får du enten via
                    WiFi eller mobilt nettverk.
                </Paragraph>
            </div>
        </article>
    )
}

interface Props {
    history: any
}

export default Privacy
