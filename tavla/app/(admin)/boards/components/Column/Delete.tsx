'use client'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { Tooltip } from '@entur/tooltip'
import { useModalWithValue } from '../../hooks/useModalWithValue'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { FormError } from 'app/(admin)/components/FormError'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import sheep from 'assets/illustrations/Sheep.png'
import Image from 'next/image'
import { SubmitButton } from 'components/Form/SubmitButton'
import { OverflowMenuItem } from '@entur/menu'
import { useToast } from '@entur/alert'
import { deleteBoardAction } from '../../utils/actions'

function Delete({
    board,
    type,
}: {
    board: TBoard
    type?: 'icon' | 'button' | 'action'
}) {
    const { addToast } = useToast()

    const [state, deleteBoard] = useFormState(deleteBoardAction, undefined)
    const { isOpen, open, close } = useModalWithValue('delete', board.id ?? '')

    const submit = async (data: FormData) => {
        deleteBoard(data)
        addToast('Tavle slettet!')
    }

    return (
        <>
            <Tooltip content="Slett tavle" placement="bottom">
                <DeleteButton type={type} onClick={open} />
            </Tooltip>
            <Modal
                open={isOpen}
                size="small"
                onDismiss={close}
                closeLabel="Avbryt sletting"
                className="flex flex-col justify-start items-center text-center"
            >
                <Image src={sheep} alt="" className="h-1/2 w-1/2" />
                <Heading3 margin="bottom">Slett tavle</Heading3>
                <Paragraph className="mb-8">
                    {board?.meta?.title
                        ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"? `
                        : 'Er du sikker på at du vil slette denne tavlen? '}
                    Tavlen vil være borte for godt og ikke mulig å finne tilbake
                    til.
                </Paragraph>

                <form action={submit} onSubmit={close} className="w-full">
                    <HiddenInput id="bid" value={board.id} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="flex flex-row">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Slett tavle"
                            className="w-1/2"
                        >
                            Ja, slett!
                        </SubmitButton>

                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={close}
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
    type,
    onClick,
}: {
    type?: 'button' | 'icon' | 'action'
    onClick: () => void
}) {
    if (type === 'button') {
        return (
            <Button
                variant="secondary"
                aria-label="Slett tavle"
                onClick={onClick}
            >
                Slett tavle
                <DeleteIcon />
            </Button>
        )
    }
    if (type === 'action')
        return (
            <OverflowMenuItem onSelect={onClick}>
                <div className="flex flex-row">
                    <DeleteIcon inline />
                    Slett tavle
                </div>
            </OverflowMenuItem>
        )
    return (
        <IconButton aria-label="Slett tavle" onClick={onClick}>
            <DeleteIcon />
        </IconButton>
    )
}

export { Delete, DeleteButton }
