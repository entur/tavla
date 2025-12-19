'use client'

import { IconButton } from '@entur/button'
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { BoardDB } from 'types/db-types/boards'
import { getBoardLink } from 'utils/boardLink'

type PreviewBoard = {
    id: string
    altText: string
    theme: BoardDB['theme']
}
export const PREVIEW_BOARDS: PreviewBoard[] = [
    {
        id: 'preview-1',
        altText:
            'Eksempel på avgangstavle for Lysaker stasjon, med avganger for tog og buss.',
        theme: 'dark',
    },
    {
        id: 'preview-2',
        altText:
            'Eksempel på avgangstavle for Horten ferjekai, med avganger for ferje.',
        theme: 'light',
    },
    {
        id: 'preview-3',
        altText: 'Eksempel på avgangstavle for Alta sentrum og Alta lufthavn.',
        theme: 'dark',
    },
]

const CarouselIndicators = ({
    previewBoards,
    activeIndex,
    onClick,
}: {
    previewBoards: PreviewBoard[]
    activeIndex: number
    onClick: (index: number) => void
}) => {
    return (
        <div
            className="mt-4 flex flex-row justify-center space-x-5 md:space-x-3"
            aria-label="Knapper for å bytte mellom avgangstavler"
        >
            {previewBoards.map((_, index) => (
                <button
                    key={index}
                    className={`bottom-5 h-6 w-6 rounded-full md:h-5 md:w-5 ${
                        index === activeIndex ? 'bg-blue' : 'bg-tertiary'
                    }`}
                    aria-label={
                        index === activeIndex
                            ? `Aktiv knapp for tavle ${index + 1}`
                            : `Bytt til tavle ${index + 1}`
                    }
                    onClick={() => onClick(index)}
                />
            ))}
        </div>
    )
}

function PreviewCarousel() {
    const [boardIndex, setBoardIndex] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const posthog = usePostHog()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const nextSlide = () => {
        posthog.capture('CAROUSEL_ARROW_BTN')
        setBoardIndex((prevIndex) =>
            prevIndex === PREVIEW_BOARDS.length - 1 ? 0 : prevIndex + 1,
        )
    }
    const prevSlide = () => {
        posthog.capture('CAROUSEL_ARROW_BTN')
        setBoardIndex((prevIndex) =>
            prevIndex === 0 ? PREVIEW_BOARDS.length - 1 : prevIndex - 1,
        )
    }

    const goToSlide = (index: number) => {
        posthog.capture('CAROUSEL_INDICATOR_BTNS')
        setBoardIndex(index)
    }

    const currentBoard = PREVIEW_BOARDS[boardIndex] ?? undefined

    if (!currentBoard) return null

    const boardLink = isMounted ? getBoardLink(currentBoard.id) : undefined

    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full flex-row justify-between gap-2">
                <div className="my-auto ml-2 hidden md:block">
                    <IconButton
                        onClick={prevSlide}
                        aria-label="Vis forrige tavle"
                    >
                        <LeftArrowIcon size={24} />
                    </IconButton>
                </div>
                <div
                    className="sm:text-md mx-auto h-[400px] w-full overflow-hidden rounded-md border-2 border-solid text-xs md:h-[500px] xl:w-[1000px]"
                    aria-label={currentBoard.altText}
                    data-theme={currentBoard.theme ?? 'dark'}
                >
                    {boardLink && (
                        <iframe
                            className="h-full w-full"
                            title="Tavle preview"
                            src={boardLink}
                            key={boardLink}
                        />
                    )}
                </div>
                <div className="my-auto mr-2 hidden md:block">
                    <IconButton
                        onClick={nextSlide}
                        aria-label="Vis neste tavle"
                    >
                        <RightArrowIcon size={24} />
                    </IconButton>
                </div>
            </div>

            <CarouselIndicators
                previewBoards={PREVIEW_BOARDS}
                activeIndex={boardIndex}
                onClick={goToSlide}
            />
        </div>
    )
}
export { PreviewCarousel }
