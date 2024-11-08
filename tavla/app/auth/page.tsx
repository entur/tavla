import { redirect } from 'next/navigation'

async function Auth(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const { mode, oobCode } = searchParams

    switch (mode) {
        case 'resetPassword':
            return redirect(`/reset/${oobCode}`)
        case 'verifyEmail':
            return redirect(`/verify/${oobCode}`)
        default:
            return redirect('/')
    }
}

export default Auth
