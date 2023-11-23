import { Heading2, LeadParagraph } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { setOrganziationFooterInfo } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { TOrganization } from 'types/settings'
import { FooterInfoInput } from './FooterInfoInput'

function Info({ organization }: { organization: TOrganization }) {
    const setOrganzationInfo = async (data: FormData) => {
        'use server'

        const info = data.get('info') as string
        await setOrganziationFooterInfo(info, organization.id)
        revalidatePath('/')
    }

    return (
        <form action={setOrganzationInfo} className="flexColumn g-1">
            <Contrast>
                <Heading2>Legg til informasjon</Heading2>
                <LeadParagraph>
                    Her kan du legge til informasjon som vil vises på alle
                    tavlene til organisasjonen.
                </LeadParagraph>
            </Contrast>

            <FooterInfoInput organzation={organization} />
        </form>
    )
}

export { Info }
