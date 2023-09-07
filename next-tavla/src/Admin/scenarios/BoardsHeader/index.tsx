import { Heading1 } from '@entur/typography'
import { CreateBoard } from '../CreateBoard'
import classes from './styles.module.css'

function BoardsHeader() {
    return (
        <div className={classes.header}>
            <Heading1>Mine Tavler</Heading1>
            <div>
                <CreateBoard />
            </div>
        </div>
    )
}
export { BoardsHeader }
