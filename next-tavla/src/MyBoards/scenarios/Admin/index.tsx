import { Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { List } from '../List'
import { TSettings } from 'types/settings'

function Admin({
    boards,
}: {
    boards: { id: string; settings: TSettings | undefined }[]
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

export { Admin }
