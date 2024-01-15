import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { permanentRedirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { getBoard } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { Board } from 'Board/scenarios/Board'

export default async function Edit({ params }: { params: { id: TBoardID } }) {
    const user = await getUserFromSessionCookie()
    if (!user) return permanentRedirect('/')
    const board = await getBoard(params.id)

    return (
        <div className="p-4">
            <Heading1>Rediger tavla: {board.meta?.title}</Heading1>
            <Heading2 className="pb-1">
                Forhåndsvisning av lagrede innstillinger
            </Heading2>
            <div className={classes.preview} data-theme={board.theme ?? 'dark'}>
                <Board board={board} />
            </div>
        </div>
    )
}
