'use client'

import { Button, ButtonGroup } from '@entur/button'
import { Modal } from '@entur/modal'
import {
    Link as EnturLink,
    Heading3,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import { FormError } from 'app/_components/Form/FormError'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import ClientOnlyTextField from 'app/_components/NoSSR/TextField'
import { useSearchParamsModal } from 'app/(innlogget)/hooks/useSearchParamsModal'
import {
    getFormFeedbackForField,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { useActionState } from 'react'
import { deleteAccount } from './actions'

function DeleteAccount() {
    const [isOpen, close] = useSearchParamsModal('deleteAccount')

    const posthog = usePostHog()

    const submit = async (
        _prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await deleteAccount(data)
        return formFeedback
    }

    const [formError, deleteAccountAction] = useActionState(submit, undefined)
    const { capture } = usePosthogTracking()

    return (
        <>
            <EnturLink
                href="?deleteAccount"
                as={Link}
                onClick={() => {
                    posthog.capture('DELETE_USER_LINK_FOOTER')
                }}
            >
                Slett bruker
            </EnturLink>
            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => {
                    capture('delete_user_cancelled', {
                        method: 'dismissed',
                    })
                    close()
                }}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <div className="flex flex-col items-center">
                    <Image
                        src={sheep}
                        aria-hidden="true"
                        alt="Illustrasjon av sauer"
                        className="h-1/2 w-1/2"
                    />
                    <Heading3 margin="bottom" as="h1">
                        Slett bruker
                    </Heading3>
                    <Paragraph>
                        Er du sikker på at du vil slette din bruker hos Entur
                        Tavla? Alle dine private tavler, samt tavler i mapper
                        der du er eneste medlem, vil bli slettet.
                    </Paragraph>

                    <form action={deleteAccountAction}>
                        <SubParagraph className="text-left font-medium">
                            Bekreft ved å skrive inn din e-postadresse
                        </SubParagraph>
                        <ClientOnlyTextField
                            name="confirmEmail"
                            label="E-post"
                            type="email"
                            autoComplete="email"
                            required
                            aria-required
                            {...getFormFeedbackForField('email', formError)}
                        />
                        <FormError
                            {...getFormFeedbackForField('general', formError)}
                        />

                        <ButtonGroup className="mt-8 flex flex-row">
                            <SubmitButton
                                variant="primary"
                                aria-label="Ja, slett"
                                className="w-1/2"
                                width="fluid"
                                onClick={() => {
                                    posthog.capture('DELETE_USER_BUTTON_MODAL')
                                }}
                            >
                                Ja, slett
                            </SubmitButton>
                            <Button
                                type="button"
                                variant="secondary"
                                aria-label="Avbryt sletting"
                                onClick={() => {
                                    capture('delete_user_cancelled', {
                                        method: 'cancel_button',
                                    })
                                    close()
                                }}
                                width="fluid"
                                className="w-1/2"
                            >
                                Avbryt
                            </Button>
                        </ButtonGroup>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default DeleteAccount
