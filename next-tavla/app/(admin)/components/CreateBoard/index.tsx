'use client'
import { ToastProvider } from '@entur/alert'
import { IconButton, PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Stepper } from '@entur/menu'
import { Modal } from '@entur/modal'
import { useModalWithValue } from 'app/(admin)/boards/hooks/useModalWithValue'
import { useFormState } from 'react-dom'
import { createBoard } from './actions'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { Heading3, Paragraph } from '@entur/typography'
import { Name } from './Name'
import { Organization } from './Organization'
import Link from 'next/link'

function CreateBoard() {
    const { isOpen, open, close } = useModalWithValue('create-board', '')
    const [state, formAction] = useFormState(createBoard, undefined)

    return (
        <ToastProvider>
            <IconButton onClick={open}>
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                className="flexColumn alignCenter"
                open={isOpen}
                size="medium"
                onDismiss={close}
                title="Opprett tavle"
                closeLabel="Avbryt opprettelse av tavle"
            >
                <Stepper
                    steps={['Navn og organisasjon', 'Stoppesteder']}
                    activeIndex={0}
                />

                <form
                    className="flexColumn alignCenter w-100 g-2"
                    action={formAction}
                >
                    <div className="flexColumn alignCenter w-75">
                        <div className="">
                            <Heading3 className="mt-1">
                                Sett navn og organisasjon på tavla
                            </Heading3>
                            <Name />
                            <FormError
                                {...getFormFeedbackForField('general', state)}
                            />
                            <Organization />
                            <PrimaryButton as={Link} href="/" className="mt-2">
                                Neste
                            </PrimaryButton>
                        </div>
                        <div>
                            <Heading3>Legg til stoppesteder i Tavla </Heading3>
                            <Paragraph>
                                Søk etter stoppesteder og bestem om tavla skal
                                vise alle retninger, eller flere enkelte
                                retninger.
                            </Paragraph>
                        </div>
                    </div>
                </form>
            </Modal>
        </ToastProvider>
    )
}

export { CreateBoard }
