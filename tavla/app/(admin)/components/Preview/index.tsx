'use client'

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons'
import { Board } from 'Board/scenarios/Board'
import { SetStateAction, useEffect, useState } from 'react'
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
        <div className="flex flex-row md:space-x-3 space-x-5 justify-center h-[10vh]">
            {boards.map((_, index) => (
                <button
                    key={index}
                    className={`md:w-5 md:h-5 w-6 h-6 rounded-full  bottom-5 mt-[2vh] left-1/2 ${
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
        setBoardIndex((prevIndex) =>
            prevIndex === boards.length - 1 ? 0 : prevIndex + 1,
        )
    }
    const prevSlide = () => {
        setBoardIndex((prevIndex) =>
            prevIndex === 0 ? boards.length - 1 : prevIndex - 1,
        )
    }

    const goToSlide = (index: SetStateAction<number>) => {
        setBoardIndex(index)
    }

    const currentBoard = boards[boardIndex] ?? undefined
    if (!currentBoard) return null
    return (
        <div>
            <div className="flex flex-row h-[40vh]">
                <LeftArrowIcon
                    onClick={prevSlide}
                    className="w-10 h-10 my-auto mr-5 hidden md:block"
                >
                    left
                </LeftArrowIcon>
                <div
                    className="w-full mx-auto"
                    data-theme={
                        currentBoard.theme === 'light' ? 'light' : 'dark'
                    }
                    id="default-carousel"
                    data-carousel="slide"
                >
                    <div
                        className={`w-full h-full transform transition-all duration-500 ease-in-out p-4 ${
                            fade ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Board
                            board={currentBoard}
                            style={{ display: 'flex' }}
                        />
                    </div>
                </div>
                <RightArrowIcon
                    onClick={nextSlide}
                    className="w-10 h-10 my-auto ml-5 hidden md:block"
                />
            </div>
            <div className="h-[10vh] mx-10">
                <CarouselIndicators
                    boards={boards}
                    activeIndex={boardIndex}
                    onClick={goToSlide}
                />
            </div>
        </div>
    )
}
export { Preview }
