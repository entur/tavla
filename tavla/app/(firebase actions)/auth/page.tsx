import { redirect } from 'next/navigation'

async function Auth(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const { mode, oobCode } = searchParams

    switch (mode) {
        case 'resetPassword':
            return redirect(`/tilbakestill/${oobCode}`)
        case 'verifyEmail':
            return redirect(`/verifiser/${oobCode}`)
        default:
            return redirect('/')
    }
}

export default Auth
