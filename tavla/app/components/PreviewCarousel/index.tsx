'use client'

import { IconButton } from '@entur/button'
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons'
import { Board } from 'Board/scenarios/Board'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
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
            className="flex flex-row md:space-x-3 space-x-5 justify-center mt-4"
            aria-label="Knapper for å bytte mellom avgangstavler"
        >
            {boards.map((_, index) => (
                <button
                    key={index}
                    className={`md:w-5 md:h-5 w-6 h-6 rounded-full  bottom-5 ${
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
                <div className="my-auto hidden md:block ml-2">
                    <IconButton
                        onClick={prevSlide}
                        aria-label="Vis forrige tavle"
                    >
                        <LeftArrowIcon size={24} />
                    </IconButton>
                </div>
                <div
                    className="w-full mx-auto"
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
                            <div className="md:h-96 h-72">
                                <Board board={currentBoard} />
                            </div>
                            <Footer board={currentBoard} />
                        </div>
                    </div>
                </div>
                <div className="my-auto hidden md:block mr-2">
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
