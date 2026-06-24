'use client'
import { TextField } from '@entur/form'
import { Badge } from '@entur/layout'
import { Heading2, Heading3 } from '@entur/typography'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { ElementSelect } from 'app/_components/TableSettings/ElementsSelect'
import { FontSelect } from 'app/_components/TableSettings/FontSelect'
import { InfoMessage } from 'app/_components/TableSettings/InfoMessage'
import { ThemeSelect } from 'app/_components/TableSettings/ThemeSelect'
import { TransportPaletteSelect } from 'app/_components/TableSettings/TransportPaletteSelect'
import { useAllowedPalettes } from 'app/_utils/colorPalettes'
import { Open } from 'app/(innlogget)/tavler/[id]/rediger/components/Buttons/Open'
import { WalkingDistance } from 'app/(innlogget)/tavler/[id]/rediger-beta/components/WalkingDistance'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { BoardLinkField } from './BoardLinkField'
import { PublishButton } from './PublishButton'
import { TileList } from './TileList'
import { TileSelector } from './TileSelector/TileSelector'

function EditBoardSidebar({
    board,
    setTiles,
    onAddTiles,
    onSettingsSubmit,
}: {
    board: BoardDB
    setTiles: (tiles: BoardDB['tiles']) => void
    onAddTiles: (data: FormData) => Promise<void>
    onSettingsSubmit: (data: FormData) => Promise<void>
}) {
    // Two sibling forms (info card + appearance/content) so the TileSelector,
    // which renders its own <form>, can sit between them without nesting forms
    // (invalid HTML). Both forms are merged when collecting settings.
    const formRef = useRef<HTMLFormElement | null>(null)
    const topFormRef = useRef<HTMLFormElement | null>(null)
    const titleInputRef = useRef<HTMLInputElement | null>(null)
    const allowedPalettes = useAllowedPalettes(board)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState(board.meta.title)

    useEffect(() => {
        if (!isEditingTitle) setTitleDraft(board.meta.title)
    }, [board.meta.title, isEditingTitle])

    const collectSettings = useCallback(() => {
        const data = formRef.current
            ? new FormData(formRef.current)
            : new FormData()
        if (topFormRef.current) {
            for (const [key, value] of new FormData(topFormRef.current)) {
                data.append(key, value)
            }
        }
        return data
    }, [])

    const handleChange = useCallback(async () => {
        await onSettingsSubmit(collectSettings())
    }, [onSettingsSubmit, collectSettings])

    const selectedElements: ('clock' | 'logo')[] = []
    if (!board.hideClock) selectedElements.push('clock')
    if (!board.hideLogo) selectedElements.push('logo')

    return (
        <div className="flex h-full flex-col gap-12 overflow-y-auto text-sm">
            <form
                ref={topFormRef}
                onChange={handleChange}
                onSubmit={(e) => e.preventDefault()}
            >
                <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap justify-between gap-2">
                            <div>
                                <Badge variant="primary" size="small">
                                    {board.isArrivals
                                        ? 'Ankomsttavle'
                                        : 'Avgangstavle'}
                                </Badge>
                                <Heading2 as="h1" margin="none">
                                    {board.meta.title}
                                </Heading2>
                            </div>

                            <div className="flex gap-2">
                                <Open
                                    type="button"
                                    bid={
                                        board.customUrl
                                            ? board.customUrl
                                            : board.id
                                    }
                                    board={board}
                                    trackingLocation="board_page"
                                />
                                <PublishButton board={board} />
                            </div>
                        </div>
                    </div>
                    <TextField
                        ref={titleInputRef}
                        label="Navn på tavla"
                        value={titleDraft}
                        maxLength={50}
                        disableLabelAnimation
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onBlur={async () => {
                            setIsEditingTitle(false)
                            const data = collectSettings()
                            data.set('title', titleDraft ?? '')
                            await onSettingsSubmit(data)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur()
                            if (e.key === 'Escape') {
                                setTitleDraft(board.meta.title)
                                setIsEditingTitle(false)
                            }
                        }}
                    />

                    <BoardLinkField
                        bid={board.id}
                        customUrl={board.customUrl}
                    />

                    <WalkingDistance
                        location={board.meta.location}
                        onChange={handleChange}
                    />
                </section>
            </form>

            <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
                <Heading3 margin="none">
                    Hvilke stoppesteder vil du vise på Tavla?
                </Heading3>
                <TileSelector
                    action={onAddTiles}
                    trackingLocation="board_page"
                    hideCountyFilter
                />
                <TileList board={board} setTilesLocalStorageBoard={setTiles} />
            </section>

            <form
                ref={formRef}
                onChange={handleChange}
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-12"
            >
                <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
                    <Heading3 margin="none">
                        Hvordan vil du at Tavla skal se ut?
                    </Heading3>
                    <ChoiceChipGroupGeneral
                        label="Visningstype"
                        options={[
                            {
                                value: 'separate',
                                label: 'En liste per stoppested',
                            },
                            {
                                value: 'combined',
                                label: 'Alle stoppesteder i en liste',
                            },
                        ]}
                        defaultValue={
                            board.isCombinedTiles ? 'combined' : 'separate'
                        }
                        name="viewType"
                        ariaLabel="Visningstype"
                        onChange={handleChange}
                    />
                    <ThemeSelect theme={board.theme} onChange={handleChange} />
                    <FontSelect
                        font={board.meta.fontSize}
                        onChange={handleChange}
                    />
                    <TransportPaletteSelect
                        transportPalette={board.transportPalette}
                        theme={board.theme ?? 'dark'}
                        allowedPalettes={allowedPalettes}
                        onChange={handleChange}
                    />
                </section>

                <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
                    <Heading3 margin="none">Hva vil du vise på tavla?</Heading3>

                    <InfoMessage
                        infoMessage={board.footer}
                        onBlur={handleChange}
                    />
                    <ElementSelect
                        selectedElements={selectedElements}
                        onChange={handleChange}
                    />
                </section>
            </form>
        </div>
    )
}

export { EditBoardSidebar }
