import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { setOrganizationLogo } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { LogoInput } from './LogoInput'
import { Heading2, LeadParagraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'

function UploadLogo({ organization }: { organization: TOrganization }) {
    const upload = async (data: FormData) => {
        'use server'

        const logo = data.get('logo') as File
        await setOrganizationLogo(logo, organization.id)
        revalidatePath('/')
    }

    return (
        <form action={upload} className="flexColumn g-4">
            <Contrast>
                <Heading2>Legg til logo</Heading2>
                <LeadParagraph>
                    Her kan du legge til en logo. Logoen vil vises på alle
                    tavlene til organisasjonen.
                </LeadParagraph>
            </Contrast>
            <div className={classes.logoPreview}>
                <Image
                    src={organization.logo ?? TavlaLogo}
                    alt="logo"
                    width={100}
                    height={100}
                />
            </div>
            <LogoInput />
        </form>
    )
}

export { UploadLogo }
