import { DownArrowIcon, UpArrowIcon } from '@entur/icons'
import { type Dispatch, type SetStateAction, useId } from 'react'

function Expandable({
    title,
    isOpen,
    setIsOpen,
    children,
}: {
    title: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    children: React.ReactNode
}) {
    const contentId = useId()

    return (
        <div className="fixed bottom-0 right-3 z-10 drop-shadow-lg">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between gap-2 rounded-t bg-blue20 px-6 py-2 ${!isOpen ? 'transition-all duration-150 ease-in-out hover:py-3' : ''}`}
                aria-expanded={isOpen}
                aria-controls={isOpen ? contentId : undefined}
            >
                <span className="font-semibold !text-lg sm:text-base">
                    {title}
                </span>
                {isOpen ? <DownArrowIcon /> : <UpArrowIcon />}
            </button>
            {isOpen && (
                <div
                    id={contentId}
                    className="max-h-[80vh] w-full overflow-y-auto rounded-b bg-blue10 p-4 md:w-96 lg:w-[500px]"
                >
                    {children}
                </div>
            )}
        </div>
    )
}

export { Expandable }
