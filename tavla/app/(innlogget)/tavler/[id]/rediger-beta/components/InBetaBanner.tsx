'use client'
import { BannerAlertBox } from '@entur/alert'
import { Link } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import NextLink from 'next/link'

export function InBetaBanner({ bid }: { bid: string }) {
    const { capture } = usePosthogTracking()

    return (
        <BannerAlertBox
            variant="information"
            title="Du er nå i den nye redigeringssiden for tavla"
            closable
            className="w-full"
            closeButtonLabel="lukk"
            onClose={() =>
                capture('in_beta_banner_dismissed', {
                    location: 'edit_board_page',
                })
            }
        >
            <Link
                as={NextLink}
                href={`/tavler/${bid}/rediger`}
                onClick={() =>
                    capture('in_beta_banner_go_back', {
                        location: 'edit_board_page',
                    })
                }
            >
                Gå tilbake til nåværende redigeringsside
            </Link>
        </BannerAlertBox>
    )
}
