import { RadioPanel } from '@entur/form'
import classes from './styles.module.css'

function RadioOption({ name, uuid }: { name: string; uuid: string }) {
    return (
        <div className={classes.radioWrapper}>
            <RadioPanel
                hideRadioButton
                title=""
                value={uuid}
                className={classes.radioOption}
            >
                <div className={classes.radioOptionContent}>{name}</div>
            </RadioPanel>
        </div>
    )
}

export { RadioOption }
