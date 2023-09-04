import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Board } from 'types/board'
import classes from './styles.module.css'
import tableClasses from 'styles/pages/boardstable.module.css'
import { AddTag, Tag } from 'Admin/components/Tags'
import { removeTagFromBoard, addTagToBoard } from 'utils/firebase'

function Row({ board }: { board: Board }) {
    const { addToast } = useToast()
    const router = useRouter()
    const [link, setLink] = useState('')
    const [tags, setTags] = useState<string[]>(board.settings?.tags ?? [])

    const deleteTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
        removeTagFromBoard(board.id, tag).catch(() => {
            setTags(tags)
        })
    }

    const addTag = (tag: string) => {
        setTags([...tags, tag])
        addTagToBoard(board.id, tag).catch(() => {
            setTags(tags)
        })
    }

    useEffect(() => {
        setLink(window.location.origin + '/' + board.id)
    }, [board.id])

    async function editBoard() {
        await router.push('/edit/' + board.id)
    }

    return (
        <div className={`${tableClasses.tableRow} ${classes.contentRow}`}>
            <div className={classes.dataCell}>
                {board.settings?.title ?? 'Tavla'}
            </div>
            <div className={classes.dataCell}>
                <div className={classes.link}>
                    {link}
                    <IconButton
                        aria-label="Kopier lenke"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            addToast('Lenke til Tavla kopiert')
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </div>
            </div>
            <div className={`${classes.dataCell} ${classes.tags}`}>
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        tag={tag}
                        deleteHandler={() => deleteTag(tag)}
                    />
                ))}
                <AddTag
                    tags={['Trondheim', 'Flyplass', 'Skole']}
                    addTagToBoardHandler={addTag}
                />
            </div>
            <div className={`${classes.dataCell} ${classes.options}`}>
                <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                    <EditIcon />
                </IconButton>
            </div>
            <div className={classes.dataCell}></div>
        </div>
    )
}

export { Row }
