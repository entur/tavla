'use client'
import { Button } from '@entur/button'
import { Heading1, LeadParagraph } from '@entur/typography'
import Link from 'next/link'
import landingImage from 'assets/illustrations/Landing_illustration.svg'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'

function LandingBanner({ loggedIn }: { loggedIn: boolean }) {
    const posthog = usePostHog()
    return (
        <div className="bg-secondary">
            <div className="flex flex-col container py-12 gap-10 xl:flex-row">
                <div className="flex flex-col xl:w-1/2 md:pl-20">
                    <Heading1 margin="none">Lag en avgangstavle for</Heading1>
                    <Heading1
                        className="italic !text-highlight !font-normal"
                        margin="bottom"
                    >
                        kontoret
                    </Heading1>
                    <LeadParagraph className="w-full">
                        Tavla er en gratis tjeneste som gjør det enkelt å sette
                        opp avgangstavler for offentlig transport i hele Norge!
                        Vis kollektivtilbudet i nærheten og hjelp folk til å
                        planlegge sin neste kollektivreise.
                    </LeadParagraph>
                    <div className="flex md:flex-row flex-col md:items-end w-full gap-4 mt-5">
                        {!loggedIn && (
                            <Button
                                variant="success"
                                size="medium"
                                as={Link}
                                href="?login=create"
                                onClick={() => {
                                    posthog.capture(
                                        'CREATE_USER_BTN_FROM_LANDING',
                                    )
                                }}
                            >
                                Opprett bruker
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            size="medium"
                            as={Link}
                            href="demo"
                            onClick={() => {
                                posthog.capture('DEMO_BTN_FROM_LANDING')
                            }}
                        >
                            Test ut Tavla
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row mx-auto xl:w-2/5">
                    <Image src={landingImage} alt="En avgangstavle" />
                </div>
            </div>
        </div>
    )
}
export { LandingBanner }
