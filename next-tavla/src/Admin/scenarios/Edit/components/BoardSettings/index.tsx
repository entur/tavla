import { TBoard } from 'types/settings'
import { BoardTitle } from '../BoardTitle'
import { FontsizeSelector } from '../FontsizeSelector'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { SaveStatus } from '../SaveStatus'

function BoardSettings({ board }: { board: TBoard }) {
    return (
        <div>
            <div className="flexRow justifyBetween alignCenter">
                <Heading3 className="mt-0">Innstillinger for tavla</Heading3>
                <SaveStatus board={board} />
            </div>
            <div className={classes.settings}>
                <BoardTitle title={board.meta?.title} />
                <FontsizeSelector board={board} />
            </div>
        </div>
    )
}
export { BoardSettings }
