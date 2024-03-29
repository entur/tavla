'use client'
import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Heading2, Paragraph } from '@entur/typography'
import { DeleteLogo } from './DeleteLogo'

function UploadLogo({ organization }: { organization: TOrganization }) {
    return (
        <div className="flexColumn g-2">
            <Heading2>Logo</Heading2>
            <div className="flexColumn g-4 box">
                <Paragraph margin="none">
                    Velg hvilken logo som skal vises på alle tavlene til
                    organisasjonen.
                </Paragraph>
                <div className={classes.logoPreview}>
                    <Image
                        src={organization.logo ?? TavlaLogo}
                        alt=""
                        objectFit="contain"
                        fill
                        className="p-4 "
                    />
                </div>
                {organization.logo && (
                    <DeleteLogo
                        oid={organization.id}
                        logo={organization.logo}
                    />
                )}
                {!organization.logo && <LogoInput oid={organization.id} />}
            </div>
        </div>
    )
}

export { UploadLogo }
