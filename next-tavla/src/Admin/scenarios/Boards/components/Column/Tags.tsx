import { TagChip } from '@entur/chip'
import classes from './styles.module.css'
import { AddTag } from '../AddTag'
import { TBoard } from 'types/settings'
import { TTag } from 'types/meta'
import { uniq } from 'lodash'
import { useOptimisticBoardsSettingsDispatch } from '../../utils/context'
import { SortableColumn } from './SortableColumn'

function Tags({ board }: { board: TBoard }) {
    const boardId = board.id ?? undefined
    const tags = board.meta?.tags ?? []

    const boardDispatch = useOptimisticBoardsSettingsDispatch()

    const setBoardWithNewTags = (newTags: TTag[]) => {
        const newBoard = {
            ...board,
            meta: {
                ...board.meta,
                tags: newTags,
            },
        }
        boardDispatch(
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
        <SortableColumn column="tags">
            <div className={classes.tags}>
                {tags.sort().map((tag) => (
                    <TagChip
                        key={tag}
                        aria-label={tag}
                        onClose={() => removeTag(tag)}
                    >
                        {tag}
                    </TagChip>
                ))}
                {boardId && <AddTag {...{ tags, addTag }} />}
            </div>
        </SortableColumn>
    )
}

export { Tags }
