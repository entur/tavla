import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { permanentRedirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { getBoard } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { Board } from 'Board/scenarios/Board'
import { TileSelector } from './components/TileSelector'

export default async function EditPage({
    params,
}: {
    params: { id: TBoardID }
}) {
    const user = await getUserFromSessionCookie()
    if (!user) return permanentRedirect('/')
    const board = await getBoard(params.id)

    return (
        <div className="flexColumn p-4 g-2">
            <Heading1>Rediger tavle: {board.meta?.title}</Heading1>
            <Heading2>Forhåndsvisning</Heading2>
            <div className={classes.preview} data-theme={board.theme ?? 'dark'}>
                <Board board={board} />
            </div>
            <Heading2>Stoppesteder i tavla</Heading2>
            <TileSelector
                action={async (data: FormData) => {
                    'use server'
                    console.log(data.get('stop_place'), data.get('quay'))
                }}
            />
        </div>
    )
}
