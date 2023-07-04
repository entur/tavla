import { TextField } from '@entur/form'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import classes from './styles.module.css'

function FooterInput({ footer }: { footer?: string }) {
    const dispatch = useSettingsDispatch()

    return (
        <div className={classes.footerInput}>
            <TextField
                onChange={(e) =>
                    dispatch({
                        type: 'addFooter',
                        footer: e.target.value,
                    })
                }
                size="medium"
                label="Footer"
                value={footer}
                clearable={true}
                onClear={() =>
                    dispatch({
                        type: 'addFooter',
                        footer: '',
                    })
                }
            />
        </div>
    )
}

export { FooterInput }
