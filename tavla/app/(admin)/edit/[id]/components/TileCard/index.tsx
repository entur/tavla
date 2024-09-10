'use client'
import { useToast } from '@entur/alert'
import {
    Button,
    IconButton,
    NegativeButton,
    SecondarySquareButton,
} from '@entur/button'
import { FilterChip } from '@entur/chip'
import { BaseExpand } from '@entur/expand'
import { Checkbox, Switch, TextField } from '@entur/form'
import {
    CloseIcon,
    DeleteIcon,
    DownwardIcon,
    EditIcon,
    QuestionIcon,
    UpwardIcon,
} from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import {
    Heading3,
    Heading4,
    Label,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import { ColumnModal } from 'app/(admin)/organizations/components/DefaultColumns/ColumnModal'
import Goat from 'assets/illustrations/Goat.png'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TransportIcon } from 'components/TransportIcon'
import { isArray, uniqBy } from 'lodash'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Columns, TColumn } from 'types/column'
import { TLocation } from 'types/meta'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { TransportModeAndLines } from './TransportModeAndLines'
import { deleteTile, getOrganizationForBoard, saveTile } from './actions'
import { useLines } from './useLines'
import { sortLineByPublicCode } from './utils'
import { isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useFormState } from 'react-dom'

function TileCard({
    bid,
    tile,
    address,
    demoBoard,
    setDemoBoard,
    moveItem,
    index,
    totalTiles,
}: {
    bid: TBoardID
    tile: TTile
    address?: TLocation
    demoBoard?: TBoard
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>
    moveItem: (index: number, direction: string) => void
    index: number
    totalTiles: number
}) {
    const posthog = usePostHog()
    const [isOpen, setIsOpen] = useState(false)
    const [changed, setChanged] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
    const { addToast } = useToast()

    const walkingDistanceInMinutes = Math.ceil(
        (tile.walkingDistance?.distance ?? 0) / 60,
    )
    const [offsetBasedOnWalkingDistance, setOffsetBasedOnWalkingDistance] =
        useState(walkingDistanceInMinutes === tile.offset)

    const [offset, setOffset] = useState(tile.offset ?? '')

    const submit = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const columns = data.getAll('columns') as TColumn[]
        data.delete('columns')
        const count = data.get('count') as number | null
        data.delete('count')
        const distance = data.get('showDistance') as string
        data.delete('showDistance')
        const offset = data.get('offset') as number | null
        data.delete('offset')
        const displayName = data.get('displayName') as string
        data.delete('displayName')
        if (isOnlyWhiteSpace(displayName)) {
            return getFormFeedbackForError('board/tiles-name-missing')
        }

        let lines: string[] = []
        for (const line of data.values()) {
            lines.push(line as string)
        }
        // If the length of lines equals all the lines, we don't want to include any
        lines = lines.length == count ? [] : lines

        if (columns !== tile.columns) await captureColumnChangeEvent()

        const newTile = {
            ...tile,
            columns: columns,
            whitelistedLines: lines,
            walkingDistance: {
                visible: distance === 'on',
                distance: tile.walkingDistance?.distance,
            },
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        } as TTile

        bid === 'demo' ? saveTileToDemoBoard(newTile) : saveTile(bid, newTile)
        reset()
    }
    const [state, action] = useFormState(submit, undefined)
    useEffect(() => {
        if (!address) {
            setOffsetBasedOnWalkingDistance(false)
        }
    }, [address])

    const reset = () => {
        setConfirmOpen(false)
        setChanged(false)
        setIsOpen(false)
    }

    const lines = useLines(tile)

    if (!lines)
        return (
            <div className="flex justify-between items-center bg-blue80 p-4 rounded">
                Laster...
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

    const saveTileToDemoBoard = (newTile: TTile) => {
        if (!demoBoard) return null
        const oldTileIndex = demoBoard.tiles.findIndex(
            (tile) => tile.uuid == newTile.uuid,
        )
        if (oldTileIndex === -1) return null
        demoBoard.tiles[oldTileIndex] = newTile
        setDemoBoard && setDemoBoard({ ...demoBoard })
    }

    const removeTileFromDemoBoard = (tile: TTile) => {
        if (!demoBoard) return null
        const remainingTiles = demoBoard.tiles.filter(
            (t) => t.uuid !== tile.uuid,
        )
        setDemoBoard && setDemoBoard({ ...demoBoard, tiles: remainingTiles })
    }

    return (
        <div>
            <div className="flex flex-row">
                <div
                    className={`flex justify-between items-center px-6  py-4 bg-blue80 w-full ${
                        isOpen ? 'rounded-t' : 'rounded'
                    }`}
                >
                    <div className="flex flex-row gap-4 items-center ">
                        <Heading3 margin="none">
                            {tile.displayName ?? tile.name}
                        </Heading3>
                        <div className="hidden sm:flex flex-row gap-4 h-8">
                            {transportModes.map((tm) => (
                                <TransportIcon transportMode={tm} key={tm} />
                            ))}
                        </div>
                    </div>

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
                <div
                    className={` flex flex-col ${
                        index !== 0 || index !== totalTiles - 1
                            ? 'justify-center gap-2'
                            : 'justify-between'
                    }`}
                >
                    {index !== 0 && (
                        <SecondarySquareButton
                            onClick={() => {
                                moveItem(index, 'up')
                            }}
                            aria-label="Flytt opp"
                            className="ml-2 *:!border-gray-300"
                        >
                            <UpwardIcon
                                onClick={() => {
                                    moveItem(index, 'up')
                                }}
                                aria-label="Flytt opp"
                            />
                        </SecondarySquareButton>
                    )}
                    {index !== totalTiles - 1 && (
                        <SecondarySquareButton
                            onClick={() => {
                                moveItem(index, 'down')
                            }}
                            aria-label="Flytt ned"
                            className="ml-2 *:!border-gray-300"
                        >
                            <DownwardIcon />
                        </SecondarySquareButton>
                    )}
                </div>
            </div>
            <BaseExpand open={isOpen}>
                <div
                    className={`bg-blue90 px-6 mr-14 py-4  ${
                        totalTiles == 1 && 'w-full'
                    } rounded-b`}
                >
                    <form
                        id={tile.uuid}
                        action={action}
                        onInput={() => setChanged(true)}
                    >
                        <div className="flex flex-col gap-2">
                            <Heading4 margin="bottom">
                                Navn på stoppested
                            </Heading4>
                            <div>
                                <SubParagraph margin="none">
                                    Dette navnet vil vises i tavlen.
                                </SubParagraph>
                                <SubParagraph>
                                    Det originale navnet til stoppestedet:{' '}
                                    {tile.name.split(',')[0]}
                                </SubParagraph>
                            </div>
                            <TextField
                                label="Navn på stoppested"
                                className="!w-2/5"
                                name="displayName"
                                defaultValue={tile.displayName}
                                maxLength={50}
                                {...getFormFeedbackForField('name', state)}
                            />
                        </div>
                        <Heading4>Gåavstand</Heading4>
                        <SubParagraph>
                            Vis gåavstand fra lokasjonen til Tavla til
                            stoppestedet.
                        </SubParagraph>
                        {!address && (
                            <Label className="!text-error">
                                {demoBoard
                                    ? 'Logg inn for å få tilgang til funksjonaliteten.'
                                    : 'Du må legge til en lokasjon for å kunne skru på gåavstand.'}
                            </Label>
                        )}
                        <Switch
                            name="showDistance"
                            disabled={!address}
                            defaultChecked={
                                tile.walkingDistance?.visible ?? false
                            }
                        >
                            Vis gåavstand
                        </Switch>

                        <Heading4>Forskyv avgangstid</Heading4>
                        <div className="flex flex-col gap-2">
                            <SubParagraph>
                                Vis kun avganger som går om mer enn et valgt
                                antall minutter.
                            </SubParagraph>
                            <TextField
                                label="Antall minutter"
                                name="offset"
                                id="offset"
                                type="number"
                                min={0}
                                className="!w-2/5"
                                value={offset}
                                onChange={(e) => {
                                    setOffset(e.target.valueAsNumber || '')
                                }}
                                readOnly={offsetBasedOnWalkingDistance}
                            />
                            {address &&
                                !Number.isNaN(
                                    tile.walkingDistance?.distance,
                                ) && (
                                    <Checkbox
                                        checked={offsetBasedOnWalkingDistance}
                                        onChange={() => {
                                            if (!offsetBasedOnWalkingDistance)
                                                setOffset(
                                                    walkingDistanceInMinutes,
                                                )
                                            else setOffset(tile.offset ?? '')

                                            setOffsetBasedOnWalkingDistance(
                                                !offsetBasedOnWalkingDistance,
                                            )

                                            posthog.capture(
                                                'OFFSET_BASED_ON_WALKING_DISTANCE_BTN_CLICK',
                                            )
                                        }}
                                    >
                                        Forskyv basert på gåavstand
                                    </Checkbox>
                                )}
                        </div>

                        <Heading4>Kolonner</Heading4>
                        <div className="flex flex-row items-center gap-2">
                            <SubParagraph>
                                Her bestemmer du hvilke kolonner som skal vises
                                i tavlen.
                            </SubParagraph>
                            <Tooltip
                                aria-hidden
                                placement="top"
                                content="Vis forklaring"
                            >
                                <IconButton
                                    type="button"
                                    aria-label="Vis forklaring på kolonner"
                                    onClick={() => setIsColumnModalOpen(true)}
                                >
                                    <QuestionIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <ColumnModal
                            isOpen={isColumnModalOpen}
                            setIsOpen={setIsColumnModalOpen}
                        />

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

                        <Heading4>Transportmidler og linjer</Heading4>
                        <div className="flex flex-row gap-4">
                            {linesByModeSorted.map(
                                ({ transportMode, lines }) => (
                                    <TransportModeAndLines
                                        key={transportMode}
                                        tile={tile}
                                        transportMode={transportMode}
                                        lines={lines}
                                    />
                                ),
                            )}
                        </div>
                        <HiddenInput
                            id="count"
                            value={uniqLines.length.toString()}
                        />

                        <div className="flex flex-row justify-start gap-4 mt-8">
                            <SubmitButton
                                variant="primary"
                                aria-label="lagre valg"
                            >
                                Lagre valg
                            </SubmitButton>
                            <Button variant="secondary" aria-label="avbryt">
                                Avbryt
                            </Button>
                            <NegativeButton
                                onClick={async () => {
                                    bid === 'demo'
                                        ? removeTileFromDemoBoard(tile)
                                        : await deleteTile(bid, tile)
                                    addToast(`${tile.name} fjernet!`)
                                }}
                                aria-label="Slett stoppested"
                                type="button"
                            >
                                <DeleteIcon />
                                Fjern stoppested
                            </NegativeButton>
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
