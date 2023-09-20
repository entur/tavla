import { Heading1 } from '@entur/typography'
import classes from './styles.module.css'
import { BoardList } from '../BoardList'
import { TBoard } from 'types/settings'
import dynamic from 'next/dynamic'
import { CreateBoard } from '../CreateBoard'

function Boards({ boards }: { boards: TBoard[] }) {
    return (
        <div className={classes.adminWrapper}>
            <div className={classes.header}>
                <Heading1>Mine Tavler</Heading1>
                <CreateBoard />
            </div>
            <BoardList initialBoards={boards} />
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
