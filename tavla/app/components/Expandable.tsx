import { IconButton } from '@entur/button'
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
        <div className="fixed bottom-0 right-3 z-10 w-full min-w-96 max-w-screen-sm drop-shadow-lg md:w-1/3">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-t bg-blue80 px-6 py-4"
            >
                <Heading5
                    margin="none"
                    className="!text-lg sm:text-base"
                    as="h1"
                >
                    {title}
                </Heading5>
                <IconButton
                    className="border-0!"
                    aria-label={isOpen ? 'Åpne skjema' : 'Lukk skjema'}
                >
                    {isOpen ? <DownArrowIcon /> : <UpArrowIcon />}
                </IconButton>
            </div>
            {isOpen && (
                <div className="rounded-b bg-blue90 p-4">{children}</div>
            )}
        </div>
    )
}
export { Expandable }
