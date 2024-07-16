import { SecondarySquareButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label } from '@entur/typography'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import Image from 'next/image'
import ducks from 'assets/illustrations/Ducks.png'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TextField } from '@entur/form'
import { useFormState } from 'react-dom'

import { getFormFeedbackForField } from 'app/(admin)/utils'
import { deleteProfile } from './actions'

function DeleteUser() {
    const [open, close] = useSearchParamsModal('deleteProfile')

    const [state, action] = useFormState(deleteProfile, undefined)
    return (
        <>
            <Modal
                open={open}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flex flex-col justify-start items-center text-center"
            >
                <SecondarySquareButton
                    aria-label="Avbryt sletting"
                    className="ml-auto"
                    onClick={close}
                >
                    <CloseIcon />
                </SecondarySquareButton>
                <Image src={ducks} alt="" className="h-1/2 w-1/2" />
                <Heading2>Slett bruker</Heading2>

                <form
                    action={action}
                    className="flex flex-col w-full gap-4"
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <Label className="font-medium text-left">
                        Bekreft ved å skrive inn e-postadressen til brukeren.
                    </Label>
                    <TextField
                        name="email"
                        label="E-post"
                        type="text"
                        required
                        aria-required
                        className="w-full"
                        {...getFormFeedbackForField('email', state)}
                    />

                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Slett organisasjon"
                    >
                        Ja, slett
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { DeleteUser }
