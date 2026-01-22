'use client'

import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import {
    Link as EnturLink,
    Heading3,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import sheep from 'assets/illustrations/Sheep.png'
import { SubmitButton } from 'components/Form/SubmitButton'
import Image from 'next/image'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { useActionState } from 'react'
import { FormError } from '../FormError'
import { deleteAccount } from './actions'

function DeleteAccount() {
    const [modalIsOpen, close] = useSearchParamsModal('deleteAccount')
    const posthog = usePostHog()

    const submit = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await deleteAccount(data)
        return formFeedback
    }

    const [formError, deleteAccountAction] = useActionState(submit, undefined)

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
                open={modalIsOpen}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={close}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
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
