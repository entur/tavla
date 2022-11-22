import React from 'react'
import classNames from 'classnames'
import { Heading2, Paragraph } from '@entur/typography'
import { Tile } from '../Tile/Tile'

interface Props {
    className?: string
}

const ErrorTile: React.FC<Props> = ({ className }) => (
    <Tile className={classNames(className)}>
        <Heading2>Her var det tomt!</Heading2>
        <Paragraph>
            Noe gikk galt da vi prøvde å hente informasjon om stoppestedet.
        </Paragraph>
    </Tile>
)

export { ErrorTile }
