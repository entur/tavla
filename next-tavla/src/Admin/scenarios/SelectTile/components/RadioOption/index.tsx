import { RadioPanel } from '@entur/form'
import { Loader } from '@entur/loader'
import classes from './styles.module.css'

function RadioOption({
    isLoading,
    name,
    uuid,
}: {
    isLoading: boolean
    name: string
    uuid: string
}) {
    return (
        <div className={classes.radioWrapper}>
            <RadioPanel
                hideRadioButton
                disabled={isLoading}
                title=""
                value={uuid}
                className={classes.radioOption}
            >
                <div className={classes.radioOptionContent}>
                    {isLoading ? <Loader /> : <>{name}</>}
                </div>
            </RadioPanel>
        </div>
    )
}

export { RadioOption }
