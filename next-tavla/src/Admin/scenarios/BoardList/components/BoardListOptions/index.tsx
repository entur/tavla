import { SecondarySquareButton } from '@entur/button'
import { SettingsIcon } from '@entur/icons'
import classes from './styles.module.css'

function BoardListOptions() {
    return (
        <SecondarySquareButton className={classes.boardListOptions}>
            <SettingsIcon />
        </SecondarySquareButton>
    )
}

export { BoardListOptions }
