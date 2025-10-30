import { DownArrowIcon, UpArrowIcon } from '@entur/icons'
import { Heading5 } from '@entur/typography'
import { Dispatch, SetStateAction } from 'react'

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
    return (
        <div className="fixed bottom-0 right-3 z-10 drop-shadow-lg">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-t bg-blue20 px-6 py-2 ${!isOpen ? 'transition-all duration-150 ease-in-out hover:py-3' : ''}`}
                aria-label={isOpen ? 'Åpne skjema' : 'Lukk skjema'}
            >
                <Heading5
                    margin="none"
                    className="!text-lg sm:text-base"
                    as="h1"
                >
                    {title}
                </Heading5>
                {isOpen ? <DownArrowIcon /> : <UpArrowIcon />}
            </div>
            {isOpen && (
                <div className="w-full rounded-b bg-blue10 p-4 md:w-96 lg:w-[500px]">
                    {children}
                </div>
            )}
        </div>
    )
}
export { Expandable }
