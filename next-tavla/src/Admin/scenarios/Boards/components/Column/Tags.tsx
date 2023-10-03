import { TagChip } from '@entur/chip'
import classes from './styles.module.css'
import { AddTag } from '../AddTag'
import { TBoard } from 'types/settings'
import { TTag } from 'types/meta'
import { uniq } from 'lodash'
import { useSafeBoardDispatch } from '../../hooks/useSafeBoardDispatch'

function Tags({ board }: { board: TBoard }) {
    const boardId = board.id ?? undefined
    const tags = board.meta?.tags ?? []

    const boardDispatch = useSafeBoardDispatch()

    const setBoardWithNewTags = (newTags: TTag[]) => {
        boardId &&
            boardDispatch(
                {
                    ...board,
                    meta: {
                        ...board.meta,
                        tags: newTags,
                    },
                },
                board,
            )
    }

    const removeTag = (tag: TTag) => {
        setBoardWithNewTags(tags.filter((t) => t !== tag) ?? [])
    }

    const addTag = (tag: TTag) => {
        setBoardWithNewTags(uniq([...tags, tag]))
    }

    return (
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
    )
}

export { Tags }
