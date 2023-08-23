import { PrimaryButton, SecondarySquareButton } from '@entur/button'
import { BackArrowIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { TLoginPage } from 'Admin/types/login'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { useState } from 'react'
import { CreateUser } from './components/CreateUser'
import { Email } from './components/Email'
import { Start } from './components/Start'
import { useAuth } from './hooks/useAuth'
import classes from './styles.module.css'

function Login({ user }: { user: DecodedIdToken | null }) {
    const { logout } = useAuth()

    const [showModal, setShowModal] = useState(false)
    const [pages, setPages] = useState<TLoginPage[]>([])

    if (user) {
        // return early if user is already logged in
        return <PrimaryButton onClick={logout}>Logg ut</PrimaryButton>
    }

    const pushPage = (page: TLoginPage) => {
        setPages([...pages, page])
    }

    const popPage = () => {
        setPages(pages.slice(0, -1))
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const nestedPagesExist = pages && pages.length > 0

    return (
        <>
            <PrimaryButton onClick={() => setShowModal(true)}>
                Logg inn
            </PrimaryButton>
            <Modal
                open={showModal}
                size="small"
                onDismiss={closeModal}
                closeLabel="Lukk innlogging"
                className={classes.login}
            >
                <div className={classes.actions}>
                    <SecondarySquareButton
                        onClick={closeModal}
                        aria-label="Lukk innlogging"
                    >
                        <CloseIcon />
                    </SecondarySquareButton>
                    {nestedPagesExist && (
                        <SecondarySquareButton
                            onClick={popPage}
                            aria-label="Gå tilbake"
                        >
                            <BackArrowIcon />
                        </SecondarySquareButton>
                    )}
                </div>
                <LoginPage pages={pages} pushPage={pushPage} />
            </Modal>
        </>
    )
}

function LoginPage({
    pages,
    pushPage,
}: {
    pages: TLoginPage[]
    pushPage: (page: TLoginPage) => void
}) {
    if (!pages) return <Start pushPage={pushPage} />

    const lastPage = pages.slice(-1)[0]

    switch (lastPage) {
        case 'email':
            return <Email />
        case 'create':
            return <CreateUser />
        default:
            return <Start pushPage={pushPage} />
    }
}

export { Login }
