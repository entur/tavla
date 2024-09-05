'use client'

import { Button } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

export const CreateUserButton = () => {
    const posthog = usePostHog()

    return (
        <div>
            <Heading3 as="h2" margin="bottom">
                Opprett bruker
            </Heading3>
            <Paragraph margin="none">
                Det er helt gratis å bruke Tavla!
            </Paragraph>
            <Button
                variant="success"
                as={Link}
                href="?login"
                className="mt-2"
                onClick={() => {
                    posthog.capture('LOGIN_BTN_DEMO_PAGE')
                }}
            >
                Opprett bruker
            </Button>
        </div>
    )
}

export default CreateUserButton
