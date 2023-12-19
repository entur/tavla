import { Heading3 } from '@entur/typography'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { addTagAction } from '../../utils/formActions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TBoard } from 'types/settings'
import { useFormState } from 'react-dom'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'

function AddNewTag({ board }: { board: TBoard }) {
    const [state, action] = useFormState(addTagAction, undefined)
    const handleFormSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()
        action(new FormData(event.currentTarget))
        event.currentTarget.reset()
    }
    return (
        <div className="flexCol g-1">
            <Heading3>Legg til ny merkelapp</Heading3>
            <form onSubmit={handleFormSubmit} className="flexColumn g-2">
                <div className="flexRow g-1 w-100">
                    <TextField
                        aria-label="Navn på ny merkelapp"
                        name="tag"
                        label="Merkelapp"
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <Button type="submit" variant="primary">
                        Legg til
                    </Button>
                </div>
                <FormError {...getFormFeedbackForField('general', state)} />
            </form>
        </div>
    )
}

export { AddNewTag }
