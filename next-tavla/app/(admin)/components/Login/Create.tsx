import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import { Heading3 } from '@entur/typography'
import { PrimaryButton } from '@entur/button'
import { login, create } from './actions'
import { TextField } from '@entur/form'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { auth } from 'utils/firebase'
import { revalidatePath } from 'next/cache'

function Create() {
    const submit = async (data: FormData) => {
        const email = data.get('email')?.toString()
        const password = data.get('password')?.toString()

        if (!email || !password) return

        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            await create(uid)
            await login(uid)
            revalidatePath('/')
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div>
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn g-2" action={submit}>
                <TextField name="email" label="E-post" type="email" />
                <TextField name="password" label="Passord" type="password" />
                <TextField
                    name="repeat_password"
                    label="Gjenta passord"
                    type="password"
                />
                <PrimaryButton type="submit">Opprett ny bruker</PrimaryButton>
            </form>
        </div>
    )
}

export { Create }
