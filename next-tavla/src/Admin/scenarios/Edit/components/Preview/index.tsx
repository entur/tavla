import { Heading3 } from '@entur/typography'
import classes from './styles.module.css'
import { Board } from 'Board/scenarios/Board'
import { TBoard } from 'types/settings'

function Preview({ board }: { board: TBoard }) {
    if (!board)
        return (
            <div>
                <div className={classes.preview}>
                    Forhåndsvisningen av holdeplassen kunne ikke lastes!
                </div>
            </div>
        )

    return (
        <div>
            <Heading3 className="mt-0">Forhåndsvisning</Heading3>
            <div className={classes.preview}>
                <Board board={board} preview />
            </div>
        </div>
    )
}

export { Preview }
