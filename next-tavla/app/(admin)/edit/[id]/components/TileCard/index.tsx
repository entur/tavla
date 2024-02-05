'use client'
import { BaseExpand } from '@entur/expand'
import classes from './styles.module.css'
import { TTile } from 'types/tile'
import { Button, SecondarySquareButton } from '@entur/button'
import { DeleteIcon, EditIcon, CloseIcon } from '@entur/icons'
import { useState } from 'react'
import { TBoardID } from 'types/settings'
import { Heading3, Heading4, SubParagraph } from '@entur/typography'
import { isArray, uniqBy } from 'lodash'
import { TransportIcon } from 'components/TransportIcon'
import { Columns } from 'types/column'
import { FilterChip } from '@entur/chip'
import { TColumn } from 'types/column'
import { useLines } from './useLines'
import { sortLineByPublicCode } from './utils'
import { deleteTile } from './actions'
import { TransportModeCheckbox } from './TransportModeCheckbox'
import { LineCheckbox } from './LineCheckbox'

function TileCard({ bid, tile }: { bid: TBoardID; tile: TTile }) {
    const [isOpen, setIsOpen] = useState(false)
    const lines = useLines(tile)

    if (!lines) return <div className={classes.card}>Laster..</div>

    const transportModes = uniqBy(lines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    const linesByModeSorted = transportModes
        .map((transportMode) => ({
            transportMode,
            lines: lines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    return (
        <div>
            <div className={classes.card}>
                <div className="flexRow g-2 alignCenter">
                    <div className="flexRow g-2 h-4">
                        {transportModes.map((tm) => (
                            <TransportIcon transportMode={tm} key={tm} />
                        ))}
                    </div>
                    {tile.name}
                </div>
                <div className="flexRow g-2">
                    <SecondarySquareButton
                        onClick={async () => {
                            await deleteTile(bid, tile)
                        }}
                    >
                        <DeleteIcon />
                    </SecondarySquareButton>
                    <SecondarySquareButton onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <CloseIcon /> : <EditIcon />}
                    </SecondarySquareButton>
                </div>
            </div>
            <BaseExpand open={isOpen}>
                <form
                    action={(data: FormData) => {
                        // Display the key/value pairs
                        for (const key of data.keys()) {
                            const arr = data.getAll(key)
                            console.log(arr)
                        }
                    }}
                >
                    <Heading3>Rediger stoppested: {tile.name}</Heading3>
                    <Heading4>Tabellen</Heading4>
                    <SubParagraph>
                        Her bestemmer du hvilke kolonner som skal vises i
                        tavlen.
                    </SubParagraph>
                    <div className="flexRow g-2">
                        {Object.entries(Columns).map(([key, value]) => {
                            return (
                                <FilterChip
                                    name="columns"
                                    key={key}
                                    value={value}
                                    defaultChecked={
                                        isArray(tile.columns)
                                            ? tile.columns?.includes(
                                                  key as TColumn,
                                              )
                                            : false
                                    }
                                >
                                    {value}
                                </FilterChip>
                            )
                        })}
                    </div>
                    <Heading4>Velg transportmidler og linjer</Heading4>
                    <div className="flexRow g-2">
                        {linesByModeSorted.map(({ transportMode, lines }) => (
                            <div key={transportMode}>
                                <TransportModeCheckbox
                                    tile={tile}
                                    transportMode={transportMode}
                                />
                                {lines.map((line) => (
                                    <LineCheckbox
                                        key={line.id}
                                        tile={tile}
                                        line={line}
                                        transportMode={transportMode}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flexRow justifyEnd mt-2 mr-2 mb-4">
                        <Button variant="primary" type="submit">
                            Lagre endringer
                        </Button>
                    </div>
                </form>
            </BaseExpand>
        </div>
    )
}
export { TileCard }
