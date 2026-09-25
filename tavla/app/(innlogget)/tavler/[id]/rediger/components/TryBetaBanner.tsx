'use client'
import { BannerAlertBox } from '@entur/alert'
import { Link } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import NextLink from 'next/link'

export function TryBetaBanner({ bid }: { bid: string }) {
    const { capture } = usePosthogTracking()

    return (
        <BannerAlertBox
            variant="information"
            title="Vil du teste ut den nye redigeringssiden for tavla?"
            closable
            className="w-full"
            closeButtonLabel="lukk"
            onClose={() =>
                capture('try_beta_banner_dismissed', {
                    location: 'edit_board_page',
                })
            }
        >
            <Link
                as={NextLink}
                href={`/tavler/${bid}/rediger-beta`}
                onClick={() =>
                    capture('try_beta_banner_clicked', {
                        location: 'edit_board_page',
                    })
                }
            >
                Gå til ny redigeringsside
            </Link>
        </BannerAlertBox>
    )
}
