'use client'
import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Heading2, LeadParagraph } from '@entur/typography'
import { useFormState } from 'react-dom'
import { upload } from './actions'
import { HiddenInput } from 'components/Form/HiddenInput'

function UploadLogo({ organization }: { organization: TOrganization }) {
    const [state, action] = useFormState(upload, undefined)

    return (
        <form action={action} className="flexColumn g-4">
            <Heading2>Legg til logo</Heading2>
            <LeadParagraph>
                Her kan du legge til en logo. Logoen vil vises på alle tavlene
                til organisasjonen.
            </LeadParagraph>
            <div className={classes.logoPreview}>
                <Image
                    src={organization.logo ?? TavlaLogo}
                    alt="logo"
                    fill
                    objectFit="contain"
                    className={classes.image}
                />
            </div>
            <HiddenInput id="uid" value={organization.id} />
            <LogoInput state={state} />
        </form>
    )
}

export { UploadLogo }
