'use client'

import { ButtonGroup, Button } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, Link as EnturLink } from '@entur/typography'
import Link from 'next/link'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { deleteAccount } from './actions'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState } from 'react'
import { FormError } from '../FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { useToast } from '@entur/alert'

function DeleteAccount() {
    const [modalIsOpen, close] = useSearchParamsModal('deleteAccount')
    const { addToast } = useToast()

    const deleteAccountSubmit = async () => {
        const formFeedback = deleteAccount()
        if (!formFeedback) {
            addToast('Brukerkonto slettet!')
        }
        return formFeedback
    }

    const [formError, deleteAccountAction] = useActionState(
        deleteAccountSubmit,
        undefined,
    )

    return (
        <>
            <EnturLink href="/?deleteAccount" as={Link}>
                Slett din konto
            </EnturLink>
            <Modal
                open={modalIsOpen}
                size="small"
                onDismiss={() => {
                    close()
                }}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <form action={deleteAccountAction}>
                    <Heading3 margin="bottom" as="h1">
                        Slett din konto
                    </Heading3>
                    <Paragraph>
                        Er du sikker på at du vil slette din brukerkonto hos
                        Entur Tavla? Alle tavler og organisasjoner du har
                        opprettet vil også bli slettet
                    </Paragraph>
                    <FormError
                        {...getFormFeedbackForField('general', formError)}
                    />

                    <ButtonGroup className="flex flex-row mt-8">
                        <SubmitButton
                            variant="primary"
                            aria-label="Ja, slett!"
                            className="w-1/2"
                            width="fluid"
                            onClick={() => {
                                deleteAccount()
                            }}
                        >
                            Ja, slett!
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
            </Modal>
        </>
    )
}

export default DeleteAccount
