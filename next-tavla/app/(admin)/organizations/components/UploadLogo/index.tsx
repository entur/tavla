'use client'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-blue.svg'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { DeleteLogo } from './DeleteLogo'

function UploadLogo({ organization }: { organization: TOrganization }) {
    return (
<<<<<<< HEAD
        <div className="box flex flex-col gap-1">
            <Heading2>Logo</Heading2>
=======
        <div className="box flexColumn justifyBetween">
            <Heading3 margin="none">Logo</Heading3>
>>>>>>> 3ba219ab (chore(edit): margin from design system)
            <Paragraph>
                Velg hvilken logo som skal vises på alle tavlene til
                organisasjonen.
            </Paragraph>
            <div className="relative flex items-center justify-center h-40 bg-primary border-2 rounded border-tertiary mb-4">
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
