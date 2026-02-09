'use client'
import { Heading3, Paragraph } from '@entur/typography'
import dog from 'assets/illustrations/Dog.png'
import Image from 'next/image'
import Link from 'next/link'

import { ButtonGroup, PrimaryButton, SecondaryButton } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

function WithoutUserFakeDoor() {
    const posthog = usePosthogTracking()

    return (
        <div className="flex flex-col">
            <Image
                src={dog}
                aria-hidden="true"
                alt="Illustrasjon av en hund"
                className="h-1/2 w-1/2 self-center"
            />

            <Heading3 as="h1">Wops! Dette er ikke mulig..</Heading3>
            <Paragraph>
                Vi tester om det er interessant å kunne lage tavler uten bruker.
                Du kan fortsatt lage tavler ved å opprette en bruker.
            </Paragraph>

            <ButtonGroup className="flex w-full flex-col pb-4">
                <PrimaryButton
                    width="fluid"
                    aria-label="Opprett bruker"
                    as={Link}
                    href="?login=create"
                    onClick={() => {
                        posthog.capture('user_create_started', {
                            location: 'user_modal',
                            context: 'without-user',
                        })
                    }}
                >
                    Opprett bruker
                </PrimaryButton>
                <SecondaryButton
                    width="fluid"
                    aria-label="Test ut tavla"
                    as={Link}
                    href="/demo"
                    onClick={() => {
                        posthog.capture('demo_started', {
                            location: 'user_modal',
                            context: 'without-user',
                        })
                    }}
                >
                    Test ut tavla
                </SecondaryButton>
            </ButtonGroup>
            <div className="mb-8 mt-4 w-full rounded-sm border-2"></div>
            <Paragraph className="text-center" margin="none">
                Har du allerede en bruker?{' '}
                <Link
                    className="underline"
                    href="?login=email"
                    onClick={() =>
                        posthog.capture('user_login_started', {
                            location: 'user_modal',
                            context: 'without-user',
                        })
                    }
                >
                    Logg inn
                </Link>
            </Paragraph>
        </div>
    )
}

export { WithoutUserFakeDoor }
