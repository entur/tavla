import { redirect } from 'next/navigation'

function Auth({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { mode, oobCode } = searchParams

    switch (mode) {
        case 'resetPassword':
            return redirect(`/reset/${oobCode}`)
        default:
            return redirect('/')
    }
}

export default Auth
