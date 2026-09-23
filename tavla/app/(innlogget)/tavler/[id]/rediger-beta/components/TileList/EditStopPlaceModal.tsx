'use client'
import { useToast } from '@entur/alert'
import { Button, SecondaryButton } from '@entur/button'
import { FeedbackText } from '@entur/form'
import { Modal } from '@entur/modal'
import { Heading2, Paragraph } from '@entur/typography'
import { TransportModeChip } from 'app/_components/TileCard/components/TransportModeChip'
import type { QuayWithFrontText } from 'app/_components/TileCard/types'
import { useLines } from 'app/_components/TileCard/useLines'
import { transportModeNames } from 'app/_components/TileCard/utils'
import { useMemo, useState } from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'
import { saveTile } from './actions'
import { LensToggle, type LensType } from './LensToggle'
import { LineLens } from './LineLens'
import { PlatformLens } from './PlatformLens'
import { useStopPlaceSelection } from './useStopPlaceSelection'

function availableModes(quays: QuayWithFrontText[]): TTransportMode[] {
    const modes = new Set<TTransportMode>()
    for (const quay of quays) {
        for (const line of quay.lines) {
            const mode = line.transportMode as TTransportMode | undefined
            if (mode && mode !== 'unknown') modes.add(mode)
        }
    }
    return Array.from(modes).sort((a, b) =>
        (transportModeNames(a) ?? '').localeCompare(
            transportModeNames(b) ?? '',
            'nb-NO',
        ),
    )
}

function StopPlaceEditor({
    boardId,
    tile,
    quays,
    onClose,
}: {
    boardId: string
    tile: BoardTileDB
    quays: QuayWithFrontText[]
    onClose: () => void
}) {
    const selection = useStopPlaceSelection(tile, quays)
    const [error, setError] = useState<string | undefined>()
    const [pending, setPending] = useState(false)
    const [lens, setLens] = useState<LensType>('platform')
    const { addToast } = useToast()

    const modes = useMemo(() => availableModes(quays), [quays])

    // Chip-tilstand per transportmiddel: styrer BÅDE utvelgelse og synlighet.
    // Et middel er «på» så lenge chipen står på — også om alle dets linjer er
    // manuelt avhuket. Ved åpning er et middel på hvis det har valgte linjer.
    const [activeModes, setActiveModes] = useState<Set<TTransportMode>>(
        () => new Set(modes.filter((mode) => selection.isModeSelected(mode))),
    )

    const displayQuays = useMemo(
        () =>
            quays
                .map((quay) => ({
                    ...quay,
                    lines: quay.lines.filter((line) => {
                        const mode = line.transportMode as
                            | TTransportMode
                            | undefined
                        return (
                            !mode || mode === 'unknown' || activeModes.has(mode)
                        )
                    }),
                }))
                .filter((quay) => quay.lines.length > 0),
        [quays, activeModes],
    )

    function toggleMode(mode: TTransportMode) {
        const turningOff = activeModes.has(mode)
        setActiveModes((prev) => {
            const next = new Set(prev)
            if (turningOff) next.delete(mode)
            else next.add(mode)
            return next
        })
        // Av → avvelg og skjul alle linjer for middelet. På → velg dem på igjen.
        selection.setModeSelected(mode, !turningOff)
        setError(undefined)
    }

    async function submit() {
        if (!selection.hasAnySelected && selection.totalSelectableKeys > 0) {
            setError('Velg minst én linje for å vise avganger på tavla.')
            return
        }

        const { quays: newQuays, linesWithDirection } =
            selection.getPersistence()

        const newTile: BoardTileDB = {
            ...tile,
            quays: newQuays,
            linesWithDirection,
        }

        setPending(true)
        const result = await saveTile(boardId, newTile)
        setPending(false)

        if (result?.status === 'error') {
            setError(result.message)
            return
        }

        addToast('Endringer lagret')
        onClose()
    }

    if (quays.length === 0) {
        return (
            <Paragraph>
                Det er ingen avganger fra dette stoppestedet de neste syv
                dagene.
            </Paragraph>
        )
    }

    return (
        <>
            <div className="mb-4 flex flex-col gap-3">
                <LensToggle lens={lens} onChange={setLens} />

                {modes.length > 1 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-[#626493]">
                            Velg transportmiddel
                        </span>
                        <div className="flex flex-row flex-wrap gap-2">
                            {modes.map((mode) => (
                                <TransportModeChip
                                    key={mode}
                                    mode={mode}
                                    isSelected={activeModes.has(mode)}
                                    onClick={() => toggleMode(mode)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {displayQuays.length === 0 ? (
                <Paragraph>
                    Ingen transportmidler valgt. Slå på et transportmiddel over
                    for å velge linjer.
                </Paragraph>
            ) : lens === 'platform' ? (
                <PlatformLens
                    quays={displayQuays}
                    selection={selection}
                    onChanged={() => setError(undefined)}
                />
            ) : (
                <LineLens
                    quays={displayQuays}
                    selection={selection}
                    onChanged={() => setError(undefined)}
                />
            )}

            {error && <FeedbackText variant="negative">{error}</FeedbackText>}

            <div className="mt-4 flex flex-row gap-2">
                <Button variant="primary" onClick={submit} loading={pending}>
                    Lagre
                </Button>
                <SecondaryButton onClick={onClose} disabled={pending}>
                    Avbryt
                </SecondaryButton>
            </div>
        </>
    )
}

function EditStopPlaceModalContent({
    boardId,
    tile,
    isArrivals,
    onClose,
}: {
    boardId: string
    tile: BoardTileDB
    isArrivals: boolean
    onClose: () => void
}) {
    const quays = useLines(tile, isArrivals)

    if (!quays) {
        return <Paragraph>Laster plattformer og linjer …</Paragraph>
    }

    const quaysWithLines = quays.filter((q) => q.lines.length > 0)

    return (
        <StopPlaceEditor
            boardId={boardId}
            tile={tile}
            quays={quaysWithLines}
            onClose={onClose}
        />
    )
}

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    tile,
    boardId,
    isArrivals,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    tile: BoardTileDB
    boardId: string
    isArrivals: boolean
}) {
    return (
        <Modal open={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
            <Heading2 as="h1">Rediger {tile.displayName ?? tile.name}</Heading2>
            {isOpen && (
                <EditStopPlaceModalContent
                    boardId={boardId}
                    tile={tile}
                    isArrivals={isArrivals}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </Modal>
    )
}

export { EditStopPlaceModal }
