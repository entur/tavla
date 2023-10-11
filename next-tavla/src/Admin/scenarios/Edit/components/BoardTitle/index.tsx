import { TextField } from '@entur/form'
import { EditIcon } from '@entur/icons'
import { ChangeEventHandler, useCallback } from 'react'
import { useEditSettingsDispatch } from '../../utils/contexts'

function BoardTitle({ title }: { title?: string }) {
    const dispatch = useEditSettingsDispatch()
    const autoSelect = useCallback((ref: HTMLInputElement) => {
        ref?.select()
    }, [])

    const dispatchTitle: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            dispatch({
                type: 'setTitle',
                title: e.target.value.length > 0 ? e.target.value : undefined,
            })
        },
        [dispatch],
    )

    return (
        <TextField
            value={title || ''}
            className="w-30"
            label="Navn på tavla"
            placeholder="Navn på tavla"
            aria-label="Endre navn på tavla"
            prepend={<EditIcon aria-hidden="true" />}
            onChange={dispatchTitle}
            ref={autoSelect}
        />
    )
}

export { BoardTitle }
