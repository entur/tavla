import { RadioPanel } from '@entur/form'
import { Loader } from '@entur/loader'
import { DeleteButton } from '../DeleteButton'
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
        <RadioPanel
            hideRadioButton
            disabled={isLoading}
            title=""
            value={uuid}
            className={classes.radioOption}
        >
            <div className={classes.radioOptionContent}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {name}
                        <DeleteButton uuid={uuid} />
                    </>
                )}
            </div>
        </RadioPanel>
    )
}

export { RadioOption }
