import classes from './styles.module.css'
import { UploadIcon } from '@entur/icons'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { storage } from 'firebase-admin'
import { setOrganizationLogo } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { UploadElement } from './UploadElement'

function UploadLogo({ organization }: { organization: TOrganization }) {
    const upload = async (data: FormData) => {
        'use server'
        const logo = data.get('logo') as File
        const bucket = storage().bucket('ent-tavla-dev.appspot.com')
        const file = bucket.file(
            `organizations/${organization.id}-${logo.name}`,
        )
        file.save(Buffer.from(await logo.arrayBuffer()))

        setOrganizationLogo(file.publicUrl(), organization.id)
        revalidatePath('/')
    }

    return (
        <form action={upload}>
            <Image
                src={organization.logo ?? TavlaLogo}
                alt="logo"
                width={100}
                height={100}
            />
            <UploadElement />

            <div className="flexRow justifyBetween g-2 mt-2">
                <button type="submit" className="w-100">
                    Avbryt
                </button>
                <button type="submit" className="w-100">
                    Last opp logo
                </button>
            </div>
        </form>
    )
}

export { UploadLogo }
