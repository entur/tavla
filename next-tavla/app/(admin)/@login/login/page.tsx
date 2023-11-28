'use client'
import Link from 'next/link'
import { Modal } from '@entur/modal'
import { useRouter } from 'next/navigation'

function Login() {
    const router = useRouter()
    return (
        <>
            <Link href="#login" scroll={false}>
                Logg inn
            </Link>
            <Modal open size="medium" onDismiss={() => router.back()}>
                Login
            </Modal>
        </>
    )
}

export default Login
