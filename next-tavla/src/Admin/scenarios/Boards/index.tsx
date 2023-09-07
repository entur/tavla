import classes from './styles.module.css'
import { BoardList } from '../BoardList'
import { TSettings } from 'types/settings'
import dynamic from 'next/dynamic'
import { BoardsHeader } from '../BoardsHeader'

function Boards({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
    return (
        <div className={classes.adminWrapper}>
            <BoardsHeader />
            <BoardList boards={boards} />
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
