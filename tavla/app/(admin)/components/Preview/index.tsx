'use client'

import { IconButton } from '@entur/button'
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons'
import { Board } from 'Board/scenarios/Board'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
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
        <div className="flex flex-row md:space-x-3 space-x-5 justify-center mt-4">
            {boards.map((_, index) => (
                <button
                    key={index}
                    className={`md:w-5 md:h-5 w-6 h-6 rounded-full  bottom-5 ${
                        index === activeIndex ? 'bg-blue' : 'bg-tertiary'
                    }`}
                    onClick={() => onClick(index)}
                />
            ))}
        </div>
    )
}

function Preview({ boards }: { boards: TBoard[] }) {
    const [boardIndex, setBoardIndex] = useState(0)
    const [fade, setFade] = useState(true)
    const posthog = usePostHog()

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setBoardIndex((boardIndex + 1) % boards.length)
                setFade(true)
            }, 500)
        }, 4500)
        return () => clearInterval(interval)
    }, [boardIndex, boards])

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
        <div className="xl:w-1/2 h-[50vh] overflow-hidden rounded-2xl py-10 w-full">
            <div className="flex flex-row h-[40vh]">
                <div className="my-auto hidden md:block ml-2">
                    <IconButton
                        onClick={prevSlide}
                        aria-label="Vis forrige tavle"
                    >
                        <LeftArrowIcon />
                    </IconButton>
                </div>
                <div
                    className="w-full mx-auto"
                    data-theme={currentBoard.theme ?? 'dark'}
                >
                    <div
                        aria-label="Eksempel på avgangstavler"
                        className={`w-full h-full transform transition-all duration-500 ease-in-out p-2 ${
                            fade ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Board
                            aria-hidden
                            board={currentBoard}
                            style={{ display: 'flex' }}
                        />
                    </div>
                </div>
                <div className="my-auto hidden md:block mr-2">
                    <IconButton
                        onClick={nextSlide}
                        aria-label="Vis neste tavle"
                    >
                        <RightArrowIcon />
                    </IconButton>
                </div>
            </div>

            <CarouselIndicators
                boards={boards}
                activeIndex={boardIndex}
                onClick={goToSlide}
            />
        </div>
    )
}
export { Preview }
