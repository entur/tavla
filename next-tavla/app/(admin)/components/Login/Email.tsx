import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'utils/firebase'
import { login } from './actions'
import { revalidatePath } from 'next/cache'
import { Heading3 } from '@entur/typography'
import { TextField } from '@entur/form'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'

import Link from 'next/link'

function Email() {
    const getPathWithParams = useSearchParamsSetter('login')

    const submit = async (data: FormData) => {
        const email = data.get('email')?.toString()
        const password = data.get('password')?.toString()

        if (!email || !password) return

        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            await login(uid)
            revalidatePath('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="flexColumn alignCenter textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn w-100 g-2" action={submit}>
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />

                <PrimaryButton type="submit">Logg inn</PrimaryButton>
                <SecondaryButton as={Link} href={getPathWithParams('reset')}>
                    Glemt passord?
                </SecondaryButton>
            </form>
        </div>
    )
}

export { Email }
