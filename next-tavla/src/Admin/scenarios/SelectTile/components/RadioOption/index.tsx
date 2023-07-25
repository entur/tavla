import { RadioPanel } from '@entur/form'
import classes from './styles.module.css'

function RadioOption({ name, uuid }: { name: string; uuid: string }) {
    return (
        <RadioPanel
            hideRadioButton
            title=""
            value={uuid}
            className={classes.radioOption}
        >
            <div className={classes.radioOptionContent}>{name}</div>
        </RadioPanel>
    )
}

export { RadioOption }
