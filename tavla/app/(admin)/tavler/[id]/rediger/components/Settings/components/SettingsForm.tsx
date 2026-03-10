'use client'
import { Heading2, Heading3, SubParagraph } from '@entur/typography'
import { TFormFeedback } from 'app/(admin)/utils'
import { ReactNode, useCallback, useRef } from 'react'
import { BoardDB } from 'src/types/db-types/boards'
import { useAllowedPalettes } from '../colorPalettes'
import { Elements, ElementSelect } from './ElementsSelect'
import { FontSelect } from './FontSelect'
import { Footer } from './Footer'
import { ThemeSelect } from './ThemeSelect'
import { Title } from './Title'
import { TransportPaletteSelect } from './TransportPaletteSelect'
import { ViewType } from './ViewType'
import { WalkingDistance } from './WalkingDistance'

const getSelectedElements = (board: BoardDB): Elements[] => {
    const elements: Elements[] = []
    if (!board.hideClock) elements.push('clock')
    if (!board.hideLogo) elements.push('logo')
    return elements
}

function SettingsForm({
    board,
    onSubmit,
    formError,
    titleFeedback,
    additionalInputs,
}: {
    board: BoardDB
    onSubmit: (data: FormData) => Promise<void>
    formError?: ReactNode
    titleFeedback?: TFormFeedback
    additionalInputs?: ReactNode
}) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const allowedPalettes = useAllowedPalettes(board)

    const handleChange = useCallback(async () => {
        if (!formRef.current) return
        await onSubmit(new FormData(formRef.current))
    }, [onSubmit])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-tintLight px-2 py-2 md:px-6 md:py-8">
            <Heading2>Innstillinger</Heading2>
            {formError}
            <form className="flex flex-col gap-6 lg:flex-row" ref={formRef}>
                <div className="box shrink bg-white">
                    <Heading3 margin="bottom">Tavlevisning</Heading3>
                    <div className="flex flex-col gap-4">
                        <ViewType
                            hasCombinedTiles={
                                board.combinedTiles ? true : false
                            }
                            onChange={handleChange}
                        />
                        <ThemeSelect
                            theme={board.theme}
                            onChange={handleChange}
                        />
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
                        {additionalInputs}
                    </div>
                </div>
                <div className="box bg-white md:min-w-[480px]">
                    <Heading3 margin="none">Tilleggsinformasjon</Heading3>
                    <SubParagraph className="mt-0">
                        Felter markert med * er påkrevd.
                    </SubParagraph>
                    <div className="flex flex-col gap-4">
                        <Title
                            title={board.meta?.title ?? ''}
                            feedback={titleFeedback}
                            onBlur={handleChange}
                        />
                        <WalkingDistance
                            location={board.meta.location}
                            onChange={handleChange}
                        />
                        <Footer
                            infoMessage={board.footer}
                            onBlur={handleChange}
                        />
                        <ElementSelect
                            selectedElements={getSelectedElements(board)}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export { SettingsForm }
