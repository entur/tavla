'use client'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-blue.svg'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Heading2, Paragraph } from '@entur/typography'
import { DeleteLogo } from './DeleteLogo'

function UploadLogo({ organization }: { organization: TOrganization }) {
    return (
        <div className="box flex flex-col gap-1">
            <Heading2>Logo</Heading2>
            <Paragraph>
                Velg hvilken logo som skal vises på alle tavlene til
                organisasjonen.
            </Paragraph>
            <div className="relative flex items-center justify-center h-[10em] bg-alpha border-2 rounded border-base-tertiary mb-4">
                <Image
                    src={organization.logo ?? TavlaLogo}
                    alt=""
                    objectFit="contain"
                    fill
                    className="p-8"
                />
            </div>
            {organization.logo && (
                <DeleteLogo oid={organization.id} logo={organization.logo} />
            )}
            {!organization.logo && <LogoInput oid={organization.id} />}
        </div>
    )
}

export { UploadLogo }
