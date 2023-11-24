import Link from 'next/link'
import { Modal } from 'components/Modal'
import { BackButton } from 'Admin/components/BackButton'
import { CloseIcon } from '@entur/icons'

function Login() {
    return (
        <>
            <Link href="/login">Logg inn</Link>

            <Modal
                open
                size="small"
                close={<BackButton icon={<CloseIcon />} />}
            >
                Login
            </Modal>
        </>
    )
}

export default Login
