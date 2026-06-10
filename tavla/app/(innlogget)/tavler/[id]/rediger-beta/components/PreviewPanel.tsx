'use client'
import { Button } from '@entur/button'
import { SubParagraph } from '@entur/typography'
import { useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { Open } from '../../rediger/components/Buttons/Open'
import { UpdateScreenNow } from './UpdateScreenNow'

const FORMATS = [
    { key: 'landscape', label: 'Liggende', ratio: 16 / 9 },
    { key: 'portrait', label: 'Stående', ratio: 9 / 16 },
    { key: 'ultrawide', label: 'Ultrabred', ratio: 32 / 9 },
    { key: 'square', label: 'Firkant', ratio: 1 },
] as const

type FormatKey = (typeof FORMATS)[number]['key']

/**
 * The permanent, format-aware preview (problems #1 and #2, grep A + B).
 * It stays beside the controls so any change is seen in the same glance, and
 * the format selector lets the operator preview real screen shapes (tall,
 * ultrawide, …) instead of a single assumed widescreen. Format is editor-only
 * and is not stored on the board.
 */
function PreviewPanel({
    boardLink,
    theme,
    board,
}: {
    boardLink: string
    theme: string
    board: BoardDB
}) {
    const [formatKey, setFormatKey] = useState<FormatKey>('landscape')
    const format = FORMATS.find((f) => f.key === formatKey) ?? FORMATS[0]
    const isTall = format.ratio < 1
    const openBid = board.customUrl ?? board.id

    return (
        <div className="flex flex-col gap-3">
            <fieldset className="flex flex-wrap gap-2 border-0 p-0">
                <legend className="sr-only">
                    Velg skjermformat for forhåndsvisning
                </legend>
                {FORMATS.map((f) => (
                    <Button
                        key={f.key}
                        size="small"
                        variant={f.key === formatKey ? 'primary' : 'secondary'}
                        aria-pressed={f.key === formatKey}
                        onClick={() => setFormatKey(f.key)}
                    >
                        {f.label}
                    </Button>
                ))}
            </fieldset>

            <section
                data-theme={theme}
                aria-label="Forhåndsvisning av tavle"
                className="flex max-h-[78vh] items-center justify-center overflow-auto rounded-md bg-tintLight p-3"
            >
                <div
                    className="mx-auto bg-black shadow-md"
                    style={
                        isTall
                            ? {
                                  height: '72vh',
                                  aspectRatio: String(format.ratio),
                                  maxWidth: '100%',
                              }
                            : {
                                  width: '100%',
                                  aspectRatio: String(format.ratio),
                                  maxHeight: '72vh',
                              }
                    }
                >
                    <iframe
                        className="h-full w-full border-0"
                        title="Forhåndsvisning av tavle"
                        src={boardLink}
                        sandbox="allow-scripts allow-same-origin"
                        referrerPolicy="no-referrer"
                        tabIndex={-1}
                    />
                </div>
            </section>

            <div className="flex flex-col gap-3 rounded-md bg-tintLight p-3">
                <SubParagraph className="m-0">
                    Endringene lagres automatisk og vises på skjermen i løpet av
                    kort tid. Trykk «Oppdater skjermen nå» for å vise dem
                    umiddelbart – nyttig ved avvik.
                </SubParagraph>
                <div className="flex flex-wrap items-center gap-3">
                    <UpdateScreenNow board={board} />
                    <Open
                        bid={openBid}
                        type="button"
                        trackingLocation="board_page"
                    />
                </div>
            </div>
        </div>
    )
}

export { PreviewPanel }
