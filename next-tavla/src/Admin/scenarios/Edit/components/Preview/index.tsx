import { Heading3 } from '@entur/typography'
import classes from './styles.module.css'
import { Board } from 'Board/scenarios/Board'
import { TBoard } from 'types/settings'
import { ExpandablePanel } from '@entur/expand'
import { useState } from 'react'

function Preview({ board }: { board: TBoard }) {
    const [open, setOpen] = useState(true)
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
            <ExpandablePanel
                title={open ? 'Skjul forhåndsvisning' : 'Vis forhåndsvisning'}
                open={open}
                onToggle={() => setOpen(!open)}
            >
                <div className={classes.preview}>
                    <Board board={board} />
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { Preview }
