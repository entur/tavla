import React from 'react'
import { NewIcon } from '@entur/icons'
import './styles.scss'
import { getDocumentId } from '../../../utils'

const UpgradeTavlaBanner = (): JSX.Element => {
    const documentId = getDocumentId()

    if (documentId) return null
    return (
        <div className="banner">
            <NewIcon className="banner__icon" />
            <span>
                <b>Vi pusser opp Tavla! </b>
                <a href="/" className="banner__link">
                    Lag din tavle på nytt
                </a>{' '}
                for å få tilgang til de nye funksjonene.
            </span>
        </div>
    )
}

export default UpgradeTavlaBanner
