import { Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { List } from '../List'
import { TSettings } from 'types/settings'
import dynamic from 'next/dynamic'

function Boards({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
    return (
        <div className={classes.adminWrapper}>
            <Heading2>Mine Tavler</Heading2>
            <div>
                <List boards={boards} />
            </div>
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
