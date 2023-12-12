'use client'
import { Modal } from '@entur/modal'
import { AddNewTag } from './AddNewTag'
import { TBoard } from 'types/settings'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import { CloseIcon, ReferenceIcon } from '@entur/icons'
import { ActionChip } from '@entur/chip'
import { AddExistingTag } from './AddExistingTag'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { removeTagAction } from '../../utils/formActions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useFormState } from 'react-dom'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'

function TagModal({ board }: { board: TBoard }) {
    const tags = board.meta?.tags ?? []
    const { setQuery, deleteQuery } = useParamsSetter()
    const { hasPage, pageParam } = usePageParam('addTags')
    const [state, action] = useFormState(removeTagAction, undefined)
    return (
        <>
            <Tooltip content="Administrer merkelapper" placement="bottom">
                <IconButton
                    aria-label="Administrer merkelapper"
                    onClick={() => setQuery('addTags', board.id || '')}
                >
                    <ReferenceIcon />
                </IconButton>
            </Tooltip>

            <Modal
                size="medium"
                open={hasPage && board.id === pageParam}
                title={`Administrer merkelapper for ${
                    board.meta?.title ?? DEFAULT_BOARD_NAME
                }`}
                onDismiss={() => deleteQuery('addTags')}
                closeOnClickOutside
            >
                <div className="flexRow flexWrap g-1 pb-2">
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
                                {tag} <CloseIcon />
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
