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
            <div>
                Tilgjengelighetserklæring (bokmål)
                <ExternalIcon className={classes.Icon} />
            </div>
        </a>
        <a
            href="https://uustatus.no/nn/erklaringer/publisert/9fd7ca5e-7d93-4dac-8c4b-9b0b75502627"
            target="_blank"
            rel="noreferrer"
            className={classes.Link}
            aria-label="Tilgjengelighetserklæring (nynorsk)"
        >
            <div>
                Tilgjengelighetserklæring (nynorsk)
                <ExternalIcon className={classes.Icon} />
            </div>
        </a>
    </div>
)

export { Footer }
