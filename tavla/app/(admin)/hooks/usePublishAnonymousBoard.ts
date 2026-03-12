import { useToast } from '@entur/alert'
import { publishBoard } from 'app/lag-tavle/actions'
import { useState } from 'react'
import { BoardDB } from 'types/db-types/boards'

export function usePublishAnonymousBoard() {
    const [publishedBoardId, setPublishedBoardId] = useState<string | null>(
        null,
    )
    const [isPublishing, setIsPublishing] = useState(false)
    const { addToast } = useToast()

    const handlePublish = async (board: BoardDB) => {
        setIsPublishing(true)
        try {
            const boardId = await publishBoard(board)
            setPublishedBoardId(boardId)
        } catch {
            addToast('Noe gikk galt. Prøv igjen.')
        } finally {
            setIsPublishing(false)
        }
    }

    const resetPublishedBoard = () => {
        setPublishedBoardId(null)
    }

    return {
        publishedBoardId,
        isPublishing,
        handlePublish,
        resetPublishedBoard,
    }
}
