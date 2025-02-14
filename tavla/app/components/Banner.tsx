'use client'

import { BannerAlertBox } from '@entur/alert'
import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import ClientOnly from './NoSSR/ClientOnly'
import { usePostHog } from 'posthog-js/react'

function Banner() {
    const [showBanner, setShowBanner] = useLocalStorage('show_banner', true)

    const posthog = usePostHog()

    if (!showBanner) return null

    return (
        <ClientOnly>
            <BannerAlertBox
                variant="information"
                closable
                onClose={() => {
                    setShowBanner(false)
                    posthog.capture('DISMISS_NEW_FUNCTIONALITY_BANNER')
                }}
                title="Nyhet! Nå kan du kombinere flere stoppesteder i en liste."
            >
                Du finner det under "Innstillinger" nederst på siden hvor du
                redigerer tavlen din.
            </BannerAlertBox>
        </ClientOnly>
    )
}

export { Banner }
