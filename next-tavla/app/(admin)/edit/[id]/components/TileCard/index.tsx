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
import { Checkbox } from '@entur/form'
import { PublicCode } from './PublicCode'
import { useLines } from './useLines'
import { sortLineByPublicCode, transportModeNames } from './utils'
import { deleteTile } from './actions'

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
                            <TransportIcon transportMode={tm} />
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
                <form>
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
                                <div className="flexRow g-2 alignCenter justifyStart">
                                    <TransportIcon
                                        transportMode={transportMode}
                                        className="w-4 h-4"
                                    />
                                    {transportModeNames(transportMode)}
                                </div>
                                <div className="flexRow alignCenter">
                                    <Checkbox
                                        defaultChecked={
                                            !tile.whitelistedLines ||
                                            tile.whitelistedLines.length === 0
                                        }
                                        onChange={(e) => {
                                            document
                                                .getElementsByName(
                                                    `${tile.uuid}-${transportMode}`,
                                                )
                                                .forEach(
                                                    (
                                                        input: HTMLInputElement,
                                                    ) => {
                                                        input.checked =
                                                            e.currentTarget.checked
                                                    },
                                                )
                                        }}
                                    >
                                        Velg alle
                                    </Checkbox>
                                </div>
                                {lines.map((line) => (
                                    <Checkbox
                                        name={`${tile.uuid}-${transportMode}`}
                                        defaultChecked={
                                            !tile.whitelistedLines ||
                                            tile.whitelistedLines.length ===
                                                0 ||
                                            tile.whitelistedLines.includes(
                                                line.id,
                                            )
                                        }
                                        key={line.id}
                                        value={line.id}
                                        className="pl-3"
                                    >
                                        <div className="flexRow alignCenter g-1">
                                            <PublicCode
                                                publicCode={line.publicCode}
                                            />
                                            {line.name}
                                        </div>
                                    </Checkbox>
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
