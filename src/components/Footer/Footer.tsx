import React from 'react'
import { ExternalIcon } from '@entur/icons'
import classes from './Footer.module.scss'

const Footer: React.FC = () => (
    <div className={classes.Footer}>
        <a
            href="https://uustatus.no/nb/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
            target="_blank"
            rel="noreferrer"
            className={classes.Link}
            aria-label="Tilgjengelighetserklæring (bokmål)"
        >
            Tilgjengelighetserklæring (bokmål)
            <ExternalIcon />
        </a>
        <a
            href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
            target="_blank"
            rel="noreferrer"
            className={classes.Link}
            aria-label="Tilgjengelighetserklæring (nynorsk)"
        >
            <>
                Tilgjengelighetserklæring (nynorsk)
                <ExternalIcon />
            </>
        </a>
    </div>
)

export { Footer }
