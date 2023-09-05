import { useState } from 'react'
import { Tag } from 'Admin/components/Tags'
import { AddTag } from '../AddTag'
import { removeTagFromBoard, addTagToBoard } from 'utils/firebase'

function Tags({
    boardId,
    boardTags,
}: {
    boardId: string
    boardTags?: string[]
}) {
    const [tags, setTags] = useState<string[]>(boardTags ?? [])

    const deleteTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
        removeTagFromBoard(boardId, tag).catch(() => {
            setTags(tags)
        })
    }

    const addTag = (tag: string) => {
        setTags([...tags, tag])
        addTagToBoard(boardId, tag).catch(() => {
            setTags(tags)
        })
    }

    return (
        <>
            {tags.map((tag) => (
                <Tag key={tag} tag={tag} deleteHandler={() => deleteTag(tag)} />
            ))}
            <AddTag
                tags={['Trondheim', 'Flyplass', 'Skole']}
                addTagToBoardHandler={addTag}
            />
        </>
    )
}

export { Tags }
