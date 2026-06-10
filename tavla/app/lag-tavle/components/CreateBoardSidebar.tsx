'use client'
import { EditIcon } from '@entur/icons'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useAllowedPalettes } from 'app/(admin)/tavler/[id]/rediger/components/Settings/colorPalettes'
import { ChoiceChipGroupGeneral } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/ChoiceChipGroupGeneral'
import { ElementSelect } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/ElementsSelect'
import { FontSelect } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/FontSelect'
import { InfoMessage } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/InfoMessage'
import { ThemeSelect } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/ThemeSelect'
import { TransportPaletteSelect } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportPaletteSelect'
import { WalkingDistance } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/WalkingDistance'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'

function CreateBoardSidebar({
    board,
    setTiles,
    onSettingsSubmit,
    resetPublishedBoard,
}: {
    board: BoardDB
    setTiles: (tiles: BoardDB['tiles']) => void
    onSettingsSubmit: (data: FormData) => Promise<void>
    resetPublishedBoard: () => void
}) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const titleInputRef = useRef<HTMLInputElement | null>(null)
    const allowedPalettes = useAllowedPalettes(board)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState(board.meta.title)

    useEffect(() => {
        if (!isEditingTitle) setTitleDraft(board.meta.title)
    }, [board.meta.title, isEditingTitle])

    const handleChange = useCallback(async () => {
        if (!formRef.current) return
        await onSettingsSubmit(new FormData(formRef.current))
    }, [onSettingsSubmit])

    const selectedElements: ('clock' | 'logo')[] = []
    if (!board.hideClock) selectedElements.push('clock')
    if (!board.hideLogo) selectedElements.push('logo')

    return (
        <div className="flex h-full flex-col gap-16 overflow-y-auto px-6 py-8 text-sm [&_h2]:text-2xl [&_h3]:text-base [&_h4]:text-sm">
            {isEditingTitle ? (
                <input
                    ref={titleInputRef}
                    className="w-full border-b-2 border-blue-dark bg-transparent text-2xl font-semibold text-blue-dark outline-none"
                    value={titleDraft}
                    maxLength={50}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={async () => {
                        setIsEditingTitle(false)
                        if (!formRef.current) return
                        const data = new FormData(formRef.current)
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
                    aria-label="Rediger navn på tavlen"
                />
            ) : (
                <div className="flex items-center gap-2">
                    <Heading2 margin="none">{board.meta.title}</Heading2>
                    <button
                        type="button"
                        aria-label="Rediger navn på tavlen"
                        className="shrink-0 text-blue-dark opacity-60 hover:opacity-100"
                        onClick={() => {
                            setTitleDraft(board.meta.title)
                            setIsEditingTitle(true)
                        }}
                    >
                        <EditIcon />
                    </button>
                </div>
            )}

            <section className="flex flex-col gap-4">
                <Heading3 margin="none">
                    Hvilke stoppesteder vil du vise på Tavla?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tiles = formDataToTiles(data)
                        setTiles([...board.tiles, ...tiles])
                        resetPublishedBoard()
                    }}
                    trackingLocation="demo_page"
                    hideCountyFilter
                />
                <TileList
                    board={board}
                    setTilesDemoBoard={setTiles}
                    bid="demo"
                />
            </section>

            <form
                ref={formRef}
                className="flex flex-col gap-16"
                onChange={handleChange}
            >
                <section className="flex flex-col gap-6">
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

                <section className="flex flex-col gap-6">
                    <Heading3 margin="none">Hva vil du vise på tavla?</Heading3>
                    <WalkingDistance
                        location={board.meta.location}
                        onChange={handleChange}
                    />
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

export { CreateBoardSidebar }
