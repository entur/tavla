import { TextField } from '@entur/form'
import { EditIcon } from '@entur/icons'
import { useCallback, useState } from 'react'
import classes from './styles.module.css'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

function BoardTitle({ title }: { title?: string }) {
    const boardTitle = title || DEFAULT_BOARD_NAME
    const [tempTitle, setTempTitle] = useState(boardTitle)
    const dispatch = useEditSettingsDispatch()
    const autoSelect = useCallback((ref: HTMLInputElement) => {
        ref?.select()
    }, [])

    const dispatchTitle = useCallback(() => {
        if (!tempTitle) {
            dispatch({
                type: 'deleteTitle',
            })
            return setTempTitle(DEFAULT_BOARD_NAME)
        }
        dispatch({
            type: 'setTitle',
            title: tempTitle,
        })
    }, [dispatch, tempTitle])

    return (
        <div className={classes.editTitle}>
            <TextField
                value={tempTitle}
                className={classes.textField}
                size="medium"
                label="Navn på tavla"
                placeholder="Navn på tavla"
                aria-label="Endre navn på tavla"
                prepend={<EditIcon />}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={dispatchTitle}
                ref={autoSelect}
            />
        </div>
    )
}

export { BoardTitle }
