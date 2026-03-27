'use client'
import { BannerAlertBox } from '@entur/alert'
import { SecondaryButton } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type BoardDB, BoardDBSchema } from 'src/types/db-types/boards'
import { saveBoardToFirebaseForUser } from '../actions'

const LOCAL_STORAGE_KEY = 'lag-tavle-board'

export function DemoBoardBanner() {
    const [board, setBoard] = useState<BoardDB | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const posthog = usePosthogTracking()

    useEffect(() => {
        const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!localStorageValue) return
        const result = BoardDBSchema.safeParse(JSON.parse(localStorageValue))
        if (result.success && result.data.tiles.length > 0) {
            setBoard(result.data)
        }
    }, [])

    if (!board) return null

    const handleContinue = async () => {
        setLoading(true)
        try {
            const boardId = await saveBoardToFirebaseForUser(board)
            localStorage.removeItem(LOCAL_STORAGE_KEY)
            posthog.capture('board_create_started', {
                location: 'admin',
                type: 'from_local_storage',
            })
            router.push(`/tavler/${boardId}/rediger`)
        } catch {
            setLoading(false)
        }
    }

    const handleDiscard = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        posthog.capture('board_dismiss_from_local_storage')
        setBoard(null)
    }

    return (
        <BannerAlertBox
            variant="information"
            title="Vi ser du har en påbegynt tavle"
            className="w-fit"
        >
            <p className="mb-4">Vil du fortsette med denne?</p>
            <div className="flex gap-3">
                <SecondaryButton
                    onClick={handleContinue}
                    loading={loading}
                    size="small"
                >
                    Fortsett
                </SecondaryButton>
                <SecondaryButton
                    onClick={handleDiscard}
                    size="small"
                    disabled={loading}
                >
                    Forkast
                </SecondaryButton>
            </div>
        </BannerAlertBox>
    )
}
