import classes from 'styles/pages/admin.module.css'
import { cookies } from 'next/headers'
import {
    getOrganization,
    initializeAdminApp,
    setOrganizationLogo,
    verifySession,
} from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'
import { storage } from 'firebase-admin'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'
import { UploadIcon } from '@entur/icons'
import TavlaLogo from 'assets/logos/Tavla-white.svg'

async function EditOrganizationPage({ params }: { params: { id: string } }) {
    const { id } = params

    const session = cookies().get('session')
    const loggedIn = await verifySession(session?.value)

    if (!loggedIn) permanentRedirect('/')

    const organization = await getOrganization(id)

    async function upload(data: FormData) {
        'use server'

        initializeAdminApp()

        const logo = data.get('logo') as File
        const bucket = storage().bucket('ent-tavla-dev.appspot.com')
        const file = bucket.file(`organizations/${id}-${logo.name}`)
        file.save(Buffer.from(await logo.arrayBuffer()))

        setOrganizationLogo(id, file.publicUrl())
        revalidatePath('/')
    }

    return (
        <div className={classes.root}>
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
                        Dra og slipp eller klikk her for å laste opp en logo
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
            <div>{id}</div>
        </div>
    )
}

export default EditOrganizationPage
