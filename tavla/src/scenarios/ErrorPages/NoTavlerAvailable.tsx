import React from 'react'
import duerLight from 'assets/images/duer@2x.png'
import { MigrationBanner } from 'components/MigrationBanner'
import { ErrorWrapper } from './components/ErrorWrapper'

function NoTavlerAvailable(): JSX.Element {
    return (
        <div>
            <MigrationBanner />
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavler som er lagret på denne kontoen."
                image={duerLight}
                // callbackMessage="Lag en ny tavle nå"
                // callback={callback}
                altText=""
            />
        </div>
    )
}

export { NoTavlerAvailable }
