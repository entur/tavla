import React from 'react'
import classNames from 'classnames'
import { Tile } from 'components/Tile'
import { TileHeader } from 'components/TileHeader'
import { Paragraph } from '@entur/typography'

function EmptyStopTile({
    className,
    title,
}: {
    className?: string
    title: string
}) {
    return (
        <Tile className={classNames(className)}>
            <TileHeader icons={[]} title={title} />
            <Paragraph>
                Vi fant ingen avganger for dette stoppestedet.
            </Paragraph>
        </Tile>
    )
}
export { EmptyStopTile }
