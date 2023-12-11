'use client'

import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading2, LeadParagraph } from '@entur/typography'
import { TOrganization } from 'types/settings'
import { setInfo } from '../actions'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
    getFormFeedbackForSuccess,
} from 'app/(admin)/utils'
import { useFormState } from 'react-dom'
import { FormError } from 'app/(admin)/components/FormError'

function Info({ organization }: { organization: TOrganization }) {
    const submit = async (
        previousState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const info = data.get('info') as string
        const oid = data.get('oid') as string

        try {
            await setInfo(oid, info)
            return getFormFeedbackForSuccess('info/success')
        } catch (error) {
            return getFormFeedbackForError('info/error')
        }
    }

    const [state, action] = useFormState(submit, undefined)

    return (
        <div className="flexColumn g-1 w-100">
            <Heading2>Legg til informasjon</Heading2>
            <LeadParagraph>
                Her kan du legge til informasjon som vil vises på alle tavlene
                til organisasjonen.
            </LeadParagraph>
            <form action={action} className="flexColumn g-1">
                <input type="hidden" name="oid" value={organization.id} />
                <TextField
                    name="info"
                    label="Informasjon"
                    defaultValue={organization.footer}
                />
                <FormError {...getFormFeedbackForField('info', state)} />
                <Button className="w-100" variant="secondary" type="submit">
                    Lagre
                </Button>
            </form>
        </div>
    )
}

export { Info }
