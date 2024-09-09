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
        <div className="flex flex-row space-x-3 justify-center h-[10vh]">
            {boards.map((_, index) => (
                <button
                    key={index}
                    className={`w-5 h-5 rounded-full -translate-x-1/2 bottom-5 mt-[3vh] left-1/2 border border-gray-700 ${
                        index === activeIndex ? 'bg-blue' : 'bg-secondary'
                    }`}
                    onClick={() => onClick(index)}
                />
            ))}
        </div>
    )
}

function Preview({ boards }: { boards: TBoard[] }) {
    const [boardIndex, setBoardIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setBoardIndex((boardIndex + 1) % boards.length)
        }, 5000)
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
                    className="w-10 h-10 my-auto mr-5"
                >
                    left
                </LeftArrowIcon>
                <div
                    className="md:w-full w-2/3 mx-auto"
                    data-theme={
                        currentBoard.theme === 'light' ? 'light' : 'dark'
                    }
                >
                    <Board board={currentBoard} style={{ display: 'flex' }} />
                </div>
                <RightArrowIcon
                    onClick={nextSlide}
                    className="w-10 h-10 my-auto ml-5"
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
