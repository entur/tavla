'use client'
import { BaseExpand } from '@entur/expand'
import classes from './styles.module.css'
import { TTile } from 'types/tile'
import { Button, SecondarySquareButton } from '@entur/button'
import { DeleteIcon, EditIcon, CloseIcon } from '@entur/icons'
import { useState } from 'react'
import { TBoardID } from 'types/settings'
import { Heading3, Heading4, Label, SubParagraph } from '@entur/typography'
import { isArray, uniqBy } from 'lodash'
import { TransportIcon } from 'components/TransportIcon'
import { Columns } from 'types/column'
import { FilterChip } from '@entur/chip'
import { TColumn } from 'types/column'
import { useLines } from './useLines'
import { sortLineByPublicCode } from './utils'
import { deleteTile, getOrganizationForBoard, saveTile } from './actions'
import { TransportModeCheckbox } from './TransportModeCheckbox'
import { LineCheckbox } from './LineCheckbox'
import { HiddenInput } from 'components/Form/HiddenInput'
import { usePostHog } from 'posthog-js/react'
import { Switch } from '@entur/form'
import { getBoard, getWalkingDistanceTile } from '../../actions'

function TileCard({ bid, tile }: { bid: TBoardID; tile: TTile }) {
    const posthog = usePostHog()
    const [isOpen, setIsOpen] = useState(false)
    const lines = useLines(tile)

    if (!lines) return <div className={classes.card}>Laster..</div>

    const uniqLines = uniqBy(lines, 'id')

    const transportModes = uniqBy(uniqLines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    const linesByModeSorted = transportModes
        .map((transportMode) => ({
            transportMode,
            lines: uniqLines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    const captureColumnChangeEvent = async () => {
        const organization = await getOrganizationForBoard(bid)
        const hasDefault = organization?.defaults?.columns !== undefined

        if (hasDefault) posthog.capture('EDIT_COLUMN_CHANGE_DEFAULT_EXISTS')
        else posthog.capture('EDIT_COLUMN_CHANGE')
    }

    return (
        <div>
            <div
                className={classes.card}
                style={{ borderRadius: isOpen ? '0.5em 0.5em 0 0' : '0.5em' }}
            >
                <div className="flexRow g-2 alignCenter">
                    <Heading3 className="m-0 pl-1">{tile.name}</Heading3>
                    <div className="flexRow g-2 h-4">
                        {transportModes.map((tm) => (
                            <TransportIcon transportMode={tm} key={tm} />
                        ))}
                    </div>
                </div>
                <div className="flexRow g-2">
                    <SecondarySquareButton
                        onClick={async () => {
                            await deleteTile(bid, tile)
                        }}
                        aria-label="Slett stoppested"
                    >
                        <DeleteIcon />
                    </SecondarySquareButton>
                    <SecondarySquareButton
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Rediger stoppested"
                    >
                        {isOpen ? <CloseIcon /> : <EditIcon />}
                    </SecondarySquareButton>
                </div>
            </div>
            <BaseExpand open={isOpen}>
                <div className={classes.expandable}>
                    <form
                        action={async (data: FormData) => {
                            const columns = data.getAll('columns') as TColumn[]
                            data.delete('columns')
                            const count = data.get('count') as number | null
                            data.delete('count')
                            const distance = data.get('showDistance') as string
                            data.delete('showDistance')

                            let lines: string[] = []
                            for (const line of data.values()) {
                                lines.push(line as string)
                            }
                            // If the length of lines equals all the lines, we don't want to include any
                            lines = lines.length == count ? [] : lines

                            if (columns !== tile.columns)
                                captureColumnChangeEvent()

                            const newTile = {
                                ...tile,
                                columns: columns,
                                whitelistedLines: lines,
                                walkingDistance: {
                                    visible: distance === 'on',
                                    distance: tile.walkingDistance?.distance,
                                },
                            } as TTile

                            if (distance === 'on' && !tile.walkingDistance) {
                                const board = await getBoard(bid)
                                return saveTile(
                                    bid,
                                    await getWalkingDistanceTile(
                                        newTile,
                                        board.meta.location,
                                    ),
                                )
                            }

                            saveTile(bid, newTile)
                        }}
                        onSubmit={() => setIsOpen(false)}
                    >
                        <Heading4 className="m-0">Kolonner</Heading4>
                        <SubParagraph className="mt-0">
                            Her bestemmer du hvilke kolonner som skal vises i
                            tavlen.
                        </SubParagraph>
                        <div className="flexRow g-2 mb-4">
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
                        <Heading4 className="mb-1">
                            Transportmidler og linjer
                        </Heading4>
                        <div className="flexRow g-2">
                            {linesByModeSorted.map(
                                ({ transportMode, lines }) => (
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
                                ),
                            )}
                        </div>
                        <div>
                            <Heading4>Gåavstand</Heading4>
                            <Label>
                                Vis gåavstand fra lokasjonen til Tavla til
                                stoppestedet
                            </Label>
                            <Switch
                                name="showDistance"
                                defaultChecked={
                                    tile.walkingDistance?.visible ?? false
                                }
                            >
                                Vis gåavstand
                            </Switch>
                        </div>
                        <HiddenInput
                            id="count"
                            value={uniqLines.length.toString()}
                        />

                        <div className="flexRow justifyEnd mt-2 mr-2 ">
                            <Button variant="primary" type="submit">
                                Lagre endringer
                            </Button>
                        </div>
                    </form>
                </div>
            </BaseExpand>
        </div>
    )
}
export { TileCard }
