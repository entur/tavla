import React from 'react'

import BackButton from '../../components/backButton/BackButton'

import './styles.scss'

const Privacy = ({ history }: Props): JSX.Element => {
    const goBackToDashboard = (): void => {
        history.push(window.location.pathname.replace('privacy', ''))
    }

    return (
        <article>
            <div className="main-container privacy-header">
                <BackButton
                    className="privacy-header--back-button"
                    action={goBackToDashboard}
                />

                <h1>Personvern</h1>
            </div>

            <div className="privacy">
                <h2>Analyseverktøy</h2>
                <p>
                    Entur bruker analyseverktøyene Google Analytics og Firebase
                    for å samle info om hvordan du bruker tjenesten, ved hjelp
                    av informasjonskapsler. Som behandlingsansvarlig for
                    Entur-appen er det Entur AS som bestemmer hvilke
                    opplysninger Google Analytics kan innhente om bruken av våre
                    tjenester.
                </p>
                <p>
                    Analyseverktøyet kan anslå din omtrentlige geografiske
                    plassering, men adressen kan ikke brukes til å identifisere
                    deg.
                </p>
                <p>
                    Google Analytics mottar generell web- og appstatistikk, som
                    for eksempel tidspunkt, språk og generell informasjon om din
                    mobilenhet. Hendelser rundt reisesøk, kjøp og billettering
                    logges anonymt til bruk for å forbedre tjenesten. Ingenting
                    av dette kan spores tilbake til enkeltbrukere.
                </p>
                <p>
                    Vi benytter to informasjonskapsler av typen _ga, én av typen
                    _gat samt én _gid. Varighet og nærmere beskrivelse av disse
                    finnes{' '}
                    <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        her
                    </a>
                    .
                </p>

                <h2>Tilganger</h2>
                <p>
                    For at reiseplanleggeren skal fungere optimalt trenger den
                    forskjellige tilganger til telefonen din. Entur-appen kan be
                    om følgende tilganger:
                </p>
                <h3>Din posisjon</h3>
                <p>
                    For at søket med «Fra din posisjon» skal fungere, må Entur
                    vite hvor du befinner deg. Denne tilgangen brukes også til å
                    vise de nærmeste stoppestedene. Posisjonen finner vi ved
                    hjelp av telefonens GPS-funksjon, WiFi-tilkoblinger,
                    IP-adresser, RFID, Bluetooth, MAC-adresser og
                    GSM/CDMA-celle-ID.
                </p>
                <p>
                    Om vi vil vite hvor du er, spør vi om lov først. Du kan
                    alltid regulere denne tilgangen i telefonens eller
                    nettleserens innstillinger.
                </p>
                <h3>Nettverkskommunikasjon</h3>
                <p>
                    For at vi skal kunne søke etter de beste reisene for deg,
                    trenger du tilgang til internett. Dette får du enten via
                    WiFi eller mobilt nettverk.
                </p>
            </div>
        </article>
    )
}

interface Props {
    history: any,
}

export default Privacy
