import classes from './styles.module.css'
import { BoardList } from '../BoardList'
import { TSettings } from 'types/settings'
import dynamic from 'next/dynamic'
import { Heading1 } from '@entur/typography'
import { CreateBoard } from '../CreateBoard'

function Boards({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
    return (
        <div className={classes.adminWrapper}>
            <div className={classes.header}>
                <Heading1>Mine Tavler</Heading1>
                <div>
                    <CreateBoard />
                </div>
            </div>
            <BoardList boards={boards} />
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
