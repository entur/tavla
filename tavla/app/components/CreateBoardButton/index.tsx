'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import Link from 'next/link'

function CreateBoardButton() {
    const posthog = usePosthogTracking()

    const isCreateBoardWithoutUserEnabled = useFeatureFlagEnabled(
        'create_board_without_user',
    )
    if (isCreateBoardWithoutUserEnabled === undefined) {
        return <p>Flag is undefined</p>
    }

    if (isCreateBoardWithoutUserEnabled) {
        return (
            <Button
                variant="primary"
                size="medium"
                onClick={() => alert('Heihei')}
            >
                Lag en tavle <ForwardIcon aria-hidden />
            </Button>
        )
    }

    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=entry"
            onClick={() => {
                posthog.capture('board_create_entry', {
                    location: 'landing_page',
                })
            }}
        >
            Lag en tavle <ForwardIcon aria-hidden />
        </Button>
    )
}

export { CreateBoardButton }
