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
    children: JSX.Element
}) {
    return (
        <div className="fixed bottom-0 right-3 w-full md:w-1/4 z-10 drop-shadow-lg ">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center px-6 py-4 bg-blue80 w-full rounded-t"
            >
                <Heading5 margin="none">{title} </Heading5>
                <IconButton className="border-0!">
                    {isOpen ? <DownArrowIcon /> : <UpArrowIcon />}
                </IconButton>
            </div>
            {isOpen && (
                <div className="rounded-b p-4 bg-blue90">{children}</div>
            )}
        </div>
    )
}
export { Expandable }
