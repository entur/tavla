import React from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import './Description.scss'

// note: kan bruke if for strings, mindre code reuse
const Description = ({ formFactor }: Props): JSX.Element | null => (
    <>
        {formFactor === FormFactor.CAR && (
            <div className="vehicles-description">
                {/* TODO: Tilpass ordet under etter om det er entall eller flertall antall ledige vehicles*/}
                <h2 className="vehicles-description-heading">Delebil</h2>
                <h3 className="vehicles-description-area">
                    Parkeringsplassen ved Vestveien
                </h3>
            </div>
        )}
        {formFactor === FormFactor.SCOOTER && (
            <div className="vehicles-description">
                {/* TODO: Tilpass ordet under etter om det er entall eller flertall antall ledige vehicles*/}
                <h2 className="vehicles-description-heading">Elsparkesykler</h2>
                <h3 className="vehicles-description-area">
                    Innen 500 meters radius
                </h3>
            </div>
        )}
        {formFactor === FormFactor.BICYCLE && (
            <div className="vehicles-description">
                {/* TODO: Tilpass ordet under etter om det er entall eller flertall antall ledige vehicles*/}
                <h2 className="vehicles-description-heading">Sykler</h2>
                <h3 className="vehicles-description-area"></h3>
            </div>
        )}
    </>
)

interface Props {
    formFactor: FormFactor
}

export { Description }
