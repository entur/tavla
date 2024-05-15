'use client'
import { BaseExpand } from '@entur/expand'
import { TTile } from 'types/tile'
import { Button, SecondarySquareButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { Switch, TextField } from '@entur/form'
import { CloseIcon, DeleteIcon, EditIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import {
    Heading3,
    Heading4,
    Label,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import Goat from 'assets/illustrations/Goat.png'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TransportIcon } from 'components/TransportIcon'
import { isArray, uniqBy } from 'lodash'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { Columns, TColumn } from 'types/column'
import { TBoardID } from 'types/settings'
import { getBoard, getWalkingDistanceTile } from '../../actions'
import { LineCheckbox } from './LineCheckbox'
import { TransportModeCheckbox } from './TransportModeCheckbox'
import { deleteTile, getOrganizationForBoard, saveTile } from './actions'
import { useLines } from './useLines'
import { sortLineByPublicCode } from './utils'

function TileCard({ bid, tile }: { bid: TBoardID; tile: TTile }) {
    const posthog = usePostHog()
    const [isOpen, setIsOpen] = useState(false)
    const [changed, setChanged] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const reset = () => {
        setConfirmOpen(false)
        setIsOpen(false)
        setChanged(false)
    }

    const lines = useLines(tile)

    if (!lines)
        return (
            <div className="flex justify-between items-center bg-secondary p-4 rounded">
                Laster..
            </div>
        )

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
                className={`flex justify-between items-center px-6 py-4 bg-secondary ${
                    isOpen ? 'rounded-t' : 'rounded'
                }`}
            >
                <div className="flex flex-row gap-4 items-center">
                    <Heading3 margin="none">{tile.name}</Heading3>
                    <div className="flex flex-row gap-4 h-8">
                        {transportModes.map((tm) => (
                            <TransportIcon transportMode={tm} key={tm} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <SecondarySquareButton
                        onClick={async () => {
                            await deleteTile(bid, tile)
                        }}
                        aria-label="Slett stoppested"
                    >
                        <DeleteIcon />
                    </SecondarySquareButton>
                    <SecondarySquareButton
                        onClick={() => {
                            if (changed) return setConfirmOpen(true)
                            setIsOpen(!isOpen)
                        }}
                        aria-label="Rediger stoppested"
                    >
                        {isOpen ? <CloseIcon /> : <EditIcon />}
                    </SecondarySquareButton>
                </div>
            </div>
            <BaseExpand open={isOpen}>
                <div className="bg-secondary px-6 py-4 rounded-b">
                    <form
                        id={tile.uuid}
                        action={async (data: FormData) => {
                            const columns = data.getAll('columns') as TColumn[]
                            data.delete('columns')
                            const count = data.get('count') as number | null
                            data.delete('count')
                            const distance = data.get('showDistance') as string
                            data.delete('showDistance')
                            const offset = data.get('offset') as number | null
                            data.delete('offset')

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
                                offset: Number(offset),
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
                        onSubmit={reset}
                        onInput={() => setChanged(true)}
                    >
                        <div>
                            <Heading4 className="m-0">Gåavstand</Heading4>
                            <Label className="text-primary">
                                Vis gåavstand fra lokasjonen til Tavla til
                                stoppestedet
                            </Label>
                            <div className="flex flex-col">
                                {tile.walkingDistance?.visible ?? (
                                    <Label
                                        className="text-warning mb-2"
                                        margin="top"
                                    >
                                        Du må legge til en lokasjon for å kunne
                                        skru på gåavstand
                                    </Label>
                                )}
                                <Switch
                                    name="showDistance"
                                    defaultChecked={
                                        tile.walkingDistance?.visible ?? false
                                    }
                                    disabled={
                                        tile.walkingDistance?.visible ?? false
                                    }
                                >
                                    Vis gåavstand
                                </Switch>
                            </div>
                        </div>
                        <div className="gap-4 mb-8">
                            <Heading4 className="mb-1">
                                Avganger frem i tid
                            </Heading4>
                            <Label>
                                Vis kun avganger som går om mer enn valgt antall
                                minutter
                            </Label>
                            <TextField
                                label="Antall minutter"
                                name="offset"
                                type="number"
                                min={0}
                                className="w-1/3"
                                defaultValue={
                                    tile.offset ? tile.offset : undefined
                                }
                            />
                        </div>

                        <Heading4 className="m-0">Kolonner</Heading4>
                        <SubParagraph className="mt-0">
                            Her bestemmer du hvilke kolonner som skal vises i
                            tavlen
                        </SubParagraph>
                        <div className="flex flex-row flex-wrap gap-4 mb-8">
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
                        <Heading4 className="mr-2">
                            Transportmidler og linjer
                        </Heading4>
                        <div className="flex flex-row gap-4">
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
                        <HiddenInput
                            id="count"
                            value={uniqLines.length.toString()}
                        />

                        <div className="flex flex-row justify-end mt-8">
                            <SubmitButton variant="primary">
                                Lagre endringer
                            </SubmitButton>
                        </div>
                        <Modal
                            size="small"
                            open={confirmOpen}
                            onDismiss={reset}
                            closeLabel="Avbryt endring"
                        >
                            <div className="flex flex-col items-center">
                                <Image alt="" src={Goat} width={250} />
                                <Heading3 margin="bottom">
                                    Lagre endringer
                                </Heading3>
                                <Paragraph>
                                    Du har endringer som ikke er lagret
                                </Paragraph>
                                <div className="flex flex-row gap-4">
                                    <Button
                                        variant="secondary"
                                        width="fluid"
                                        onClick={reset}
                                    >
                                        Avbryt endring
                                    </Button>
                                    <SubmitButton
                                        variant="primary"
                                        width="fluid"
                                        type="submit"
                                        form={tile.uuid}
                                    >
                                        Lagre
                                    </SubmitButton>
                                </div>
                            </div>
                        </Modal>
                    </form>
                </div>
            </BaseExpand>
        </div>
    )
}
export { TileCard }
