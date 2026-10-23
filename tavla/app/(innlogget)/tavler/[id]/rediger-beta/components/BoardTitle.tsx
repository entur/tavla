import type { EventProps } from 'app/posthog/events'
import { Heading1 } from 'node_modules/@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { EditBoardTitle } from './EditTitle/EditTitle'

export function BoardTitle({
    board,
    trackingLocation,
}: {
    board: BoardDB
    trackingLocation: EventProps<'board_name_edit_started'>['location']
}) {
    return (
        <div className="flex items-center gap-4 w-full justify-start">
            <Heading1 as="h1" margin="none" className="min-w-0 break-words">
                {board.meta.title}
            </Heading1>
            <div className="shrink-0">
                <EditBoardTitle
                    board={board}
                    trackingLocation={trackingLocation}
                />
            </div>
        </div>
    )
}
