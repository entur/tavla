import { Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { List } from '../List'
import { Board } from 'types/board'

function Admin({ boards }: { boards: Board[] }) {
    return (
        <div className={classes.adminWrapper}>
            <Heading2>Mine Tavler</Heading2>
            <div>
                <List boards={boards} />
            </div>
        </div>
    )
}

export { Admin }
