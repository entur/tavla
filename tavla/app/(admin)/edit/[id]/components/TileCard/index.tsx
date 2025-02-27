'use client'
import { useToast } from '@entur/alert'
import {
    Button,
    ButtonGroup,
    IconButton,
    NegativeButton,
    SecondarySquareButton,
} from '@entur/button'
import { FilterChip } from '@entur/chip'
import { BaseExpand } from '@entur/expand'
import { Checkbox } from '@entur/form'
import {
    CloseIcon,
    DeleteIcon,
    DownwardIcon,
    EditIcon,
    QuestionFilledIcon,
    UpwardIcon,
} from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Heading4, Paragraph, SubParagraph } from '@entur/typography'
import { ColumnModal } from 'app/(admin)/folders/components/DefaultColumns/ColumnModal'
import Goat from 'assets/illustrations/Goat.png'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TransportIcon } from 'components/TransportIcon'
import { isArray, uniqBy } from 'lodash'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'
import {
    Dispatch,
    SetStateAction,
    useActionState,
    useEffect,
    useState,
} from 'react'
import {
    Columns,
    DEFAULT_COMBINED_COLUMNS,
    DEFAULT_ORGANIZATION_COLUMNS,
    TColumn,
} from 'types/column'
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
import { OLD_LINE_IDS } from '../../compatibility'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function TileCard({
    bid,
    tile,
    address,
    demoBoard,
    setDemoBoard,
    moveItem,
    index,
    totalTiles,
    isCombined,
}: {
    bid: TBoardID
    tile: TTile
    address?: TLocation
    demoBoard?: TBoard
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>
    moveItem: (index: number, direction: string) => void
    index: number
    totalTiles: number
    isCombined: boolean
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
        let columns = data.getAll('columns') as TColumn[]
        data.delete('columns')
        const count = data.get('count') as number | null
        data.delete('count')
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

        if (isCombined) {
            columns = tile.columns ?? DEFAULT_ORGANIZATION_COLUMNS
        }

        const newTile = {
            ...tile,
            columns: columns,
            whitelistedLines: lines,
            ...(address && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        } as TTile

        if (bid === 'demo') {
            saveTileToDemoBoard(newTile)
        } else {
            saveTile(bid, newTile)
        }

        reset()
    }
    const [state, action] = useActionState(submit, undefined)
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

    let lines = useLines(tile)

    if (!lines)
        return (
            <div className="flex justify-between items-center bg-blue80 p-4 rounded">
                Laster...
            </div>
        )

    // TODO: remove when old lines no longer return any data (2025)
    lines = lines.filter((line) => !OLD_LINE_IDS.includes(line.id))

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
        if (setDemoBoard) setDemoBoard({ ...demoBoard })
    }

    const removeTileFromDemoBoard = (tile: TTile) => {
        if (!demoBoard) return null
        const remainingTiles = demoBoard.tiles.filter(
            (t) => t.uuid !== tile.uuid,
        )
        if (setDemoBoard) setDemoBoard({ ...demoBoard, tiles: remainingTiles })
    }

    const uniqTransportModeIcons = transportModes
        .filter((tm) => !(tm === 'coach' && transportModes.includes('bus')))
        .map((tm) => <TransportIcon transportMode={tm} key={tm} />)

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
                            {uniqTransportModeIcons}
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
                                {isCombined && (
                                    <SubParagraph className="!text-error">
                                        Har du samlet stoppestedene i én liste
                                        vil du ikke ha mulighet til å sette navn
                                        på stoppested.
                                    </SubParagraph>
                                )}
                            </div>
                            <ClientOnlyTextField
                                label="Navn på stoppested"
                                className="!w-full md:!w-1/2 lg:!w-1/4"
                                name="displayName"
                                defaultValue={tile.displayName}
                                disabled={isCombined}
                                maxLength={50}
                                {...getFormFeedbackForField('name', state)}
                            />
                        </div>

                        <Heading4>Forskyv avgangstid</Heading4>
                        <div className="flex flex-col gap-2">
                            <SubParagraph>
                                Vis kun avganger som går om mer enn et valgt
                                antall minutter.
                            </SubParagraph>
                            <ClientOnlyTextField
                                label="Antall minutter"
                                name="offset"
                                id="offset"
                                type="number"
                                min={0}
                                className="!w-full md:!w-1/2 lg:!w-1/4"
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
                                        Forskyv basert på gangavstand
                                    </Checkbox>
                                )}
                        </div>
                        <div className="flex flex-row items-baseline gap-1">
                            <Heading4>Kolonner</Heading4>

                            <Tooltip
                                aria-hidden
                                placement="top"
                                content="Vis forklaring på kolonner"
                                id="tooltip-columns"
                            >
                                <IconButton
                                    type="button"
                                    aria-label="Vis forklaring på kolonner"
                                    onClick={() => setIsColumnModalOpen(true)}
                                >
                                    <QuestionFilledIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <SubParagraph>
                            Her bestemmer du hvilke kolonner som skal vises i
                            tavlen.
                        </SubParagraph>
                        {isCombined && (
                            <SubParagraph className="!text-error mb-2">
                                Har du samlet stoppestedene i én liste vil du
                                ikke ha mulighet til å velge kolonner.
                            </SubParagraph>
                        )}
                        <ColumnModal
                            isOpen={isColumnModalOpen}
                            setIsOpen={setIsColumnModalOpen}
                        />
                        <div className="flex flex-row flex-wrap gap-4 mb-8">
                            {Object.entries(Columns).map(([key, value]) => {
                                const columns = isCombined
                                    ? DEFAULT_COMBINED_COLUMNS
                                    : tile.columns
                                return (
                                    <FilterChip
                                        name="columns"
                                        key={key}
                                        value={key}
                                        disabled={isCombined}
                                        defaultChecked={
                                            isArray(columns) &&
                                            columns.includes(key as TColumn)
                                        }
                                    >
                                        {value}
                                    </FilterChip>
                                )
                            })}
                        </div>

                        <Heading4>Transportmidler og linjer</Heading4>
                        <div className="flex flex-col md:flex-row gap-4">
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

                        <div className="flex flex-col md:flex-row justify-start gap-4 mt-8">
                            <SubmitButton
                                variant="primary"
                                aria-label="lagre valg"
                            >
                                Lagre valg
                            </SubmitButton>
                            <Button
                                variant="secondary"
                                aria-label="avbryt"
                                type="button"
                                onClick={() => {
                                    if (changed) return setConfirmOpen(true)
                                    return setIsOpen(false)
                                }}
                            >
                                Avbryt
                            </Button>
                            <NegativeButton
                                onClick={async () => {
                                    if (bid === 'demo') {
                                        removeTileFromDemoBoard(tile)
                                    } else {
                                        await deleteTile(bid, tile)
                                    }
                                    addToast(`${tile.name} fjernet!`)
                                }}
                                aria-label="Fjern stoppested"
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
                                <Image
                                    alt=""
                                    src={Goat}
                                    className="h-1/2 w-1/2"
                                />
                                <Heading3 margin="bottom" as="h1">
                                    Lagre endringer
                                </Heading3>
                                <Paragraph>
                                    Du har endringer som ikke er lagret.
                                </Paragraph>

                                <ButtonGroup className="flex flex-row">
                                    <SubmitButton
                                        variant="primary"
                                        width="fluid"
                                        form={tile.uuid}
                                        aria-label="Lagre endringer"
                                    >
                                        Lagre
                                    </SubmitButton>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        aria-label="Avbryt sletting"
                                        onClick={reset}
                                    >
                                        Avbryt
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Modal>
                    </form>
                </div>
            </BaseExpand>
        </div>
    )
}
export { TileCard }
