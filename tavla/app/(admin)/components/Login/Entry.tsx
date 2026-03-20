'use client'
import { Heading3 } from '@entur/typography'
import squirrel from 'assets/illustrations/Squirrel.png'
import Image from 'next/image'
import Link from 'next/link'

import { ButtonGroup, SecondaryButton } from '@entur/button'
import { EmailIcon } from '@entur/icons'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import Google from './Google'

function Entry() {
    const posthog = usePosthogTracking()

    const isCreateBoardWithoutUserEnabled = useFeatureFlagEnabled(
        FeatureFlags.CreateBoardWithoutUser,
    )

    return (
        <div className="flex flex-col items-center">
            <Image
                src={squirrel}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />

            <Heading3 as="h1" className="mb-6">
                Velg hvordan du vil fortsette
            </Heading3>

            <ButtonGroup className="flex w-full flex-col pb-4">
                {isCreateBoardWithoutUserEnabled && (
                    <SecondaryButton
                        width="fluid"
                        aria-label="Fortsett uten bruker"
                        as={Link}
                        href="lag-tavle"
                        onClick={() => {
                            posthog.capture('board_create_without_user', {
                                location: 'user_modal',
                                context: 'entry',
                            })
                        }}
                    >
                        Fortsett uten bruker
                    </SecondaryButton>
                )}
                <SecondaryButton
                    width="fluid"
                    aria-label="Logg inn med mail"
                    as={Link}
                    href="?login=email"
                    onClick={() => {
                        posthog.capture('user_login_method_selected', {
                            location: 'user_modal',
                            method: 'email',
                            context: 'entry',
                        })
                    }}
                >
                    <EmailIcon /> Logg inn med mail
                </SecondaryButton>
                <Google
                    userTrackingContext="entry"
                    trackingLocation="user_modal"
                />

                <div className="mb-8 mt-4 w-full rounded-sm border-2"></div>

                <SecondaryButton
                    width="fluid"
                    aria-label="Opprett bruker"
                    as={Link}
                    href="?login=create"
                    onClick={() => {
                        posthog.capture('user_create_started', {
                            location: 'user_modal',
                            context: 'entry',
                        })
                    }}
                >
                    Opprett bruker
                </SecondaryButton>
            </ButtonGroup>
        </div>
    )
}

export { Entry }
