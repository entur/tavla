import { TTag } from 'types/meta'
import { Modal } from '@entur/modal'
import { AddNewTag } from './AddNewTag'
import { useOptimisticBoardsSettingsDispatch } from '../../utils/context'
import { TBoard } from 'types/settings'
import { uniq } from 'lodash'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import { ReferenceIcon } from '@entur/icons'
import { TagChip } from '@entur/chip'
import { AddExistingTag } from './AddExistingTag'
import { useToggle } from 'hooks/useToggle'

function TagModal({ board }: { board: TBoard }) {
    const tags = board.meta?.tags ?? []

    const [modalIsOpen, openModal, closeModal] = useToggle()

    const dispatch = useOptimisticBoardsSettingsDispatch()

    const setBoardWithNewTags = (newTags: TTag[]) => {
        const newBoard = {
            ...board,
            meta: {
                ...board.meta,
                tags: newTags.sort(),
                dateModified: Date.now(),
            },
        }
        dispatch(
            { type: 'setBoard', board: newBoard },
            '/api/board',
            { board: newBoard },
            {
                method: 'PUT',
            },
        )
    }

    const removeTag = (tag: TTag) => {
        setBoardWithNewTags(tags.filter((t) => t !== tag) ?? [])
    }

    const addTag = (tag: TTag) => {
        setBoardWithNewTags(uniq([...tags, tag]))
    }

    return (
        <>
            <Tooltip content="Administrer merkelapper" placement="bottom">
                <IconButton
                    aria-label="Administrer merkelapper"
                    onClick={openModal}
                >
                    <ReferenceIcon />
                </IconButton>
            </Tooltip>

            <Modal
                size="medium"
                open={modalIsOpen}
                title={`Administrer merkelapper for ${
                    board.meta?.title ?? 'Tavle uten navn'
                }`}
                onDismiss={closeModal}
                closeOnClickOutside
            >
                <div className="flexRow flexWrap g-1 pb-2">
                    {tags.map((tag) => (
                        <TagChip key={tag} onClose={() => removeTag(tag)}>
                            {tag}
                        </TagChip>
                    ))}
                </div>
                <AddNewTag addTag={addTag} />

                <AddExistingTag
                    addTag={addTag}
                    boardTags={board.meta?.tags ?? []}
                />
            </Modal>
        </>
    )
}

export { TagModal }
