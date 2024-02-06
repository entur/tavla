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
import { deleteTile, saveTile } from './actions'
import { TransportModeCheckbox } from './TransportModeCheckbox'
import { LineCheckbox } from './LineCheckbox'
import { HiddenInput } from 'components/Form/HiddenInput'

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
                        const columns = data.getAll('columns') as TColumn[]
                        data.delete('columns')
                        const count = data.get('count') as number | null
                        data.delete('count')

                        let lines: string[] = []
                        for (const line of data.values()) {
                            lines.push(line as string)
                        }
                        // If the length of lines equals all the lines, we don't want to include any
                        lines = lines.length == count ? [] : lines

                        saveTile(bid, {
                            ...tile,
                            columns: columns,
                            whitelistedLines: lines,
                        })
                    }}
                    onSubmit={() => setIsOpen(false)}
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
                                    value={key}
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
                    <HiddenInput id="count" value={lines.length.toString()} />
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
