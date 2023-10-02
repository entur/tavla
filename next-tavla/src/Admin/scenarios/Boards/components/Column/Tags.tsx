import { TagChip } from '@entur/chip'
import classes from './styles.module.css'
import { AddTag } from '../AddTag'
import { TBoardID } from 'types/settings'
import { TTag } from 'types/meta'
import { useBoardsSettingsDispatch } from '../../utils/context'

function Tags({ tags, boardId }: { tags: TTag[]; boardId?: TBoardID }) {
    const dispatch = useBoardsSettingsDispatch()

    const removeTag = (tag: TTag) => {
        boardId &&
            dispatch({
                type: 'removeTag',
                boardId,
                tag,
            })
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
            {boardId && <AddTag {...{ tags, boardId }} />}
        </div>
    )
}

export { Tags }
