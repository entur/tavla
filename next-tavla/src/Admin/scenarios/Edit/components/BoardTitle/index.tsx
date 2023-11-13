import { TextField } from '@entur/form'
import { EditIcon } from '@entur/icons'
import { ChangeEventHandler, useCallback } from 'react'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { selectInput } from 'Admin/utils/selectInput'
import { Heading4 } from '@entur/typography'

function BoardTitle({ title }: { title?: string }) {
    const dispatch = useEditSettingsDispatch()

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
        <div className="w-100">
            <Heading4 className="m-0">Hva skal tavla hete?</Heading4>
            <TextField
                value={title ?? ''}
                className="w-30"
                label="Navn på tavla"
                placeholder="Navn på tavla"
                aria-label="Endre navn på tavla"
                prepend={<EditIcon aria-hidden="true" />}
                onChange={dispatchTitle}
                ref={selectInput}
            />
        </div>
    )
}

export { BoardTitle }
