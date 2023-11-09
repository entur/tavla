import { UploadIcon } from '@entur/icons'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { TOrganization } from 'types/settings'
import { storage } from 'firebase-admin'
import { setOrganizationLogo } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'

function UploadLogo({ organization }: { organization: TOrganization }) {
    const upload = async (data: FormData) => {
        'use server'
        const logo = data.get('logo') as File
        const bucket = storage().bucket('ent-tavla-dev.appspot.com')
        const file = bucket.file(`organizations/${id}-${logo.name}`)
        file.save(Buffer.from(await logo.arrayBuffer()))

        setOrganizationLogo(id, file.publicUrl())
        revalidatePath('/')
    }

    return (
        <form action={upload}>
            <label
                htmlFor="logo"
                style={{
                    display: 'flex',
                    backgroundColor: 'var(--secondary-background-color)',
                    border: '2px dashed white',
                    borderRadius: '1em',
                    width: '100%',
                    height: '300px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '2em',
                }}
            >
                <Image
                    src={organization.logo ?? TavlaLogo}
                    alt="logo"
                    width={100}
                    height={100}
                />
                <div className="flexColumn alignCenter g-2">
                    <UploadIcon size={48} />
                    Klikk her for å laste opp en logo
                </div>
            </label>
            <input
                type="file"
                name="logo"
                accept="image/*"
                required
                id="logo"
                style={{ display: 'none' }}
            />
            <button type="submit">Last opp logo</button>
        </form>
    )
}

export { UploadLogo }
