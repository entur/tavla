import React from 'react'
import duerLight from 'assets/images/duer@2x.png'
import { ErrorWrapper } from './components/ErrorWrapper'

function NoSharedTavlerAvailable(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavleforespørsler for øyeblikket. Andre kan dele sine tavler med deg under «Deling»-fanen på innstillingene til tavla."
                image={duerLight}
                altText=""
            />
        </div>
    )
}

export { NoSharedTavlerAvailable }
