'use client'
import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Heading2, Paragraph } from '@entur/typography'
import { useFormState } from 'react-dom'
import { upload } from './actions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { DeleteLogo } from './DeleteLogo'

function UploadLogo({ organization }: { organization: TOrganization }) {
    const [state, action] = useFormState(upload, undefined)

    return (
        <form action={action} className="flexColumn g-4">
            <Heading2>Legg til logo</Heading2>
            <div>
                <Paragraph>
                    Her kan du legge til en logo. Logoen vil vises på alle
                    tavlene til organisasjonen. Du kan kun ha en logo om gangen.
                    Om du laster opp en ny logo vil den som er på tavlen fra før
                    erstattes med den nye logoen du laster opp.
                </Paragraph>
            </div>
            <div className={classes.logoPreview}>
                <Image
                    src={organization.logo ?? TavlaLogo}
                    alt=""
                    objectFit="contain"
                    fill
                    className="p-4 "
                />
            </div>
            <HiddenInput id="oid" value={organization.id} />
            {!organization.logo && (
                <DeleteLogo
                    oid={organization.id}
                    logo={organization.logo}
                    state={state}
                />
            )}
            <LogoInput state={state} />
        </form>
    )
}

export { UploadLogo }
