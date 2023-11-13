import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import { Login } from 'Admin/scenarios/Login'
import dynamic from 'next/dynamic'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import classes from './styles.module.css'
import { OrganizationIcon, UserIcon } from '@entur/icons'
import { CreateBoard } from 'Admin/scenarios/CreateBoard'

function AdminHeader({ loggedIn }: { loggedIn: boolean }) {
    return (
        <div className={classes.header}>
            <Link href="/">
                <Image
                    src={TavlaLogo}
                    alt="Entur Tavla logo"
                    width={117}
                    height={20}
                    className={classes.logo}
                />
            </Link>
            <div className={classes.buttons}>
                {loggedIn && (
                    <>
                        <CreateBoard loggedIn={loggedIn} />
                        <PrimaryButton as={Link} href="/boards">
                            <UserIcon />
                            Tavler
                        </PrimaryButton>
                        <PrimaryButton as={Link} href="/organizations">
                            <OrganizationIcon />
                            Organisasjoner
                        </PrimaryButton>
                    </>
                )}
                <Login loggedIn={loggedIn} />
            </div>
        </div>
    )
}

const NonSSRHeader = dynamic(() => Promise.resolve(AdminHeader), { ssr: false })

export { NonSSRHeader as AdminHeader }
