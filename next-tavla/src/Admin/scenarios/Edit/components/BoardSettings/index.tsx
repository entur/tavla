import { TBoard } from 'types/settings'
import { BoardTitle } from '../BoardTitle'
import { FontsizeSelector } from '../FontsizeSelector'
import classes from './styles.module.css'
import { AutoSave } from '../AutoSave'

function BoardSettings({ board }: { board: TBoard }) {
    return (
        <div className={classes.settings}>
            <BoardTitle title={board.meta?.title} />
            <AutoSave board={board} />
            <FontsizeSelector board={board} />
        </div>
    )
}
export { BoardSettings }
