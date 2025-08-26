'use client'

import { IconButton } from '@entur/button'
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons'
import { Board } from 'Board/scenarios/Board'
import { Header } from 'components/Header'
import { InfoMessage } from 'components/InfoMessage'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { TBoard } from 'types/settings'

const CarouselIndicators = ({
    boards,
    activeIndex,
    onClick,
}: {
    boards: TBoard[]
    activeIndex: number
    onClick: (index: number) => void
}) => {
    return (
        <div
            className="mt-4 flex flex-row justify-center space-x-5 md:space-x-3"
            aria-label="Knapper for å bytte mellom avgangstavler"
        >
            {boards.map((_, index) => (
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

function PreviewCarousel({ boards }: { boards: TBoard[] }) {
    const [boardIndex, setBoardIndex] = useState(0)
    const posthog = usePostHog()

    const nextSlide = () => {
        posthog.capture('CAROUSEL_ARROW_BTN')
        setBoardIndex((prevIndex) =>
            prevIndex === boards.length - 1 ? 0 : prevIndex + 1,
        )
    }
    const prevSlide = () => {
        posthog.capture('CAROUSEL_ARROW_BTN')
        setBoardIndex((prevIndex) =>
            prevIndex === 0 ? boards.length - 1 : prevIndex - 1,
        )
    }

    const goToSlide = (index: number) => {
        posthog.capture('CAROUSEL_INDICATOR_BTNS')
        setBoardIndex(index)
    }

    const currentBoard = boards[boardIndex] ?? undefined
    if (!currentBoard) return null
    return (
        <>
            <div className="flex flex-row">
                <div className="my-auto ml-2 hidden md:block">
                    <IconButton
                        onClick={prevSlide}
                        aria-label="Vis forrige tavle"
                    >
                        <LeftArrowIcon size={24} />
                    </IconButton>
                </div>
                <div
                    className="mx-auto w-full"
                    data-theme={currentBoard.theme ?? 'dark'}
                >
                    <div
                        className="flex"
                        aria-label="Eksempel på avgangstavler"
                    >
                        <div
                            className="previewContainer text-xs"
                            data-theme={currentBoard?.theme ?? 'dark'}
                        >
                            <Header theme={currentBoard.theme} />
                            <div className="h-72 md:h-96">
                                <Board board={currentBoard} />
                            </div>
                            <InfoMessage board={currentBoard} />
                        </div>
                    </div>
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
                boards={boards}
                activeIndex={boardIndex}
                onClick={goToSlide}
            />
        </>
    )
}
export { PreviewCarousel }
