import { TextField } from '@entur/form'
import { Heading3 } from '@entur/typography'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { Dispatch, SetStateAction, useState } from 'react'

function Name({
    title,
    setIsError,
}: {
    title?: string
    setIsError: Dispatch<SetStateAction<boolean>>
}) {
    const [state, setFormError] = useState<TFormFeedback | undefined>()

    return (
        <div className="box flex flex-col">
            <Heading3 margin="bottom">Navn</Heading3>
            <div className="h-full">
                <TextField
                    name="name"
                    className="w-full"
                    defaultValue={title ?? DEFAULT_BOARD_NAME}
                    label="Navn på tavlen"
                    maxLength={30}
                    {...getFormFeedbackForField('name', state)}
                    onChange={(e) => {
                        if (e.target.value === '') {
                            setFormError(
                                getFormFeedbackForError('board/name-missing'),
                            )
                            setIsError(true)
                        } else {
                            setFormError(undefined)
                            setIsError(false)
                        }
                    }}
                />
            </div>
        </div>
    )
}

export { Name }
