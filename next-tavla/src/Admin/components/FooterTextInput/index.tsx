import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useState } from 'react'
import classes from './styles.module.css'

function FooterTextInput({ footer = '' }: { footer?: string }) {
    const dispatch = useSettingsDispatch()
    const [text, setText] = useState(footer)
    console.log(text)
    return (
        <div className={classes.footerInput}>
            <TextField
                onChange={(e) => setText(e.target.value)}
                size="medium"
                label="Footer"
                defaultValue={text}
                clearable
                onClear={() => setText('')}
            ></TextField>
            <PrimaryButton
                onClick={() =>
                    dispatch({
                        type: 'addFooter',
                        footer: text,
                    })
                }
            >
                Legg til footer
            </PrimaryButton>
        </div>
    )
}

export { FooterTextInput }
