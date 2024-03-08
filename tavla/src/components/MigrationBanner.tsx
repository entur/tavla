import React from 'react'
import { BannerAlertBox } from '@entur/alert'
import { Link } from '@entur/typography'

function MigrationBanner() {
    return (
        <BannerAlertBox
            title="2. april blir denne versjonen av tavla erstattet med en ny og bedre løsning!"
            closable={false}
            variant="warning"
        >
            Dette betyr at dine eksisterende tavler snart forsvinner, og at du
            må opprette tavlene dine på nytt i den nye løsningen. Frem til 2.
            april finner du den nye tavla på{' '}
            <Link href="https://tavla.beta.entur.no">tavla.beta.entur.no</Link>.
            Alle tavlene du oppretter i den nye løsning vil fungere etter
            2.april uten at du trenger å foreta deg noe.
        </BannerAlertBox>
    )
}

export { MigrationBanner }
