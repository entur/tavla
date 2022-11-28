import React from 'react'
import classNames from 'classnames'
import { Paragraph } from '@entur/typography'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'

interface Props {
    className?: string
    title: string
}

const EmptyStopTile: React.FC<Props> = ({ className, title }) => (
    <Tile className={classNames(className)}>
        <TileHeader icons={[]} title={title} />
        <Paragraph>Vi fant ingen avganger for dette stoppestedet.</Paragraph>
    </Tile>
)

export { EmptyStopTile }
