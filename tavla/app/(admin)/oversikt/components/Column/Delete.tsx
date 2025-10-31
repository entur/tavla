'use client'
import { useToast } from '@entur/alert'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { OverflowMenuItem } from '@entur/menu'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { deleteBoardAction } from 'app/(admin)/oversikt/utils/actions'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import sheep from 'assets/illustrations/Sheep.png'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { BoardDB } from 'types/db-types/boards'

function Delete({
    board,
    type,
}: {
    board: BoardDB
    type?: 'icon' | 'button' | 'menuitem'
}) {
    const { addToast } = useToast()

    const [state, deleteBoard] = useActionState(deleteBoardAction, undefined)
    const [isOpen, setIsOpen] = useState(false)

    const submit = async (data: FormData) => {
        deleteBoard(data)
        addToast('Tavle slettet!')
    }

    return (
        <>
            <DeleteButton
                text="Slett tavle"
                type={type}
                onClick={() => setIsOpen(true)}
            />
            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => setIsOpen(false)}
                closeLabel="Avbryt sletting"
                className="flex flex-col items-center justify-start text-center"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <Image src={sheep} alt="" className="h-1/2 w-1/2" />
                <Heading3 margin="bottom" as="h1">
                    Slett tavle
                </Heading3>
                <Paragraph className="mb-8">
                    {board?.meta?.title
                        ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"? `
                        : 'Er du sikker på at du vil slette denne tavlen? '}
                    Tavlen vil være borte for godt og ikke mulig å finne tilbake
                    til.
                </Paragraph>

                <form
                    action={submit}
                    onSubmit={() => setIsOpen(false)}
                    className="w-full"
                >
                    <HiddenInput id="bid" value={board.id} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="flex flex-row">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Ja, slett"
                            className="w-1/2"
                        >
                            Ja, slett
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={() => setIsOpen(false)}
                            className="w-1/2"
                            width="fluid"
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

function DeleteButton({
    text,
    type,
    onClick,
}: {
    text: string
    type?: 'button' | 'icon' | 'menuitem'
    onClick: () => void
}) {
    if (type === 'button') {
        return (
            <Button variant="secondary" aria-label={text} onClick={onClick}>
                {text}
                <DeleteIcon aria-label="Slette-ikon" />
            </Button>
        )
    } else if (type === 'menuitem') {
        return <OverflowMenuItem onClick={onClick}>{text}</OverflowMenuItem>
    }
    return (
        <Tooltip content={text} placement="bottom" id="tooltip-delete-board">
            <IconButton aria-label={text} onClick={onClick}>
                <DeleteIcon aria-label="Slette-ikon" />
            </IconButton>
        </Tooltip>
    )
}

export { Delete, DeleteButton }
