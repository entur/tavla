'use client'
import { useActionState } from 'react'
import { Modal } from '@entur/modal'
import { AddNewTag } from './AddNewTag'
import { TBoard } from 'types/settings'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import { CloseIcon, ReferenceIcon } from '@entur/icons'
import { ActionChip } from '@entur/chip'
import { AddExistingTag } from './AddExistingTag'
import { HiddenInput } from 'components/Form/HiddenInput'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { useModalWithValue } from '../../hooks/useModalWithValue'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { removeTag } from './actions'

function TagModal({ board }: { board: TBoard }) {
    const tags = board.meta?.tags ?? []
    const { isOpen, open, close } = useModalWithValue('addTags', board.id ?? '')
    const [state, action] = useActionState(removeTag, undefined)
    return (
        <>
            <Tooltip
                content="Administrer merkelapper"
                placement="bottom"
                id="tooltip-manage-tags"
            >
                <IconButton aria-label="Administrer merkelapper" onClick={open}>
                    <ReferenceIcon />
                </IconButton>
            </Tooltip>

            <Modal
                size="medium"
                open={isOpen}
                title={`Administrer merkelapper for ${
                    board.meta?.title ?? DEFAULT_BOARD_NAME
                }`}
                onDismiss={close}
                closeOnClickOutside
            >
                <div className="flex flex-row flex-wrap gap-1 pb-8">
                    {tags.map((tag) => (
                        <form key={tag} action={action}>
                            <HiddenInput id="bid" value={board.id} />
                            <FormError
                                {...getFormFeedbackForField('general', state)}
                            />
                            <ActionChip
                                key={tag}
                                name="tag"
                                value={tag}
                                type="submit"
                            >
                                {tag.toUpperCase()} <CloseIcon />
                            </ActionChip>
                        </form>
                    ))}
                </div>
                <AddNewTag board={board} />
                <AddExistingTag board={board} />
            </Modal>
        </>
    )
}

export { TagModal }
