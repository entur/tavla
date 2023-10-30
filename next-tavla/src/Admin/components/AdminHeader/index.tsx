import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import { Login } from 'Admin/scenarios/Login'
import dynamic from 'next/dynamic'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import classes from './styles.module.css'
import { CreateBoard } from '../CreateBoard'
import { OrganizationIcon, UserIcon } from '@entur/icons'
import { checkFeatureFlags } from 'utils/featureFlags'

function AdminHeader({ loggedIn }: { loggedIn: boolean }) {
    const ORGANIZATIONS_ENABLED = checkFeatureFlags('ORGANIZATIONS')
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
                            Mine Tavler
                        </PrimaryButton>
                        {ORGANIZATIONS_ENABLED && (
                            <PrimaryButton as={Link} href="/organizations">
                                <OrganizationIcon />
                                Organisasjoner
                            </PrimaryButton>
                        )}
                    </>
                )}
                <Login loggedIn={loggedIn} />
            </div>
        </div>
    )
}

const NonSSRHeader = dynamic(() => Promise.resolve(AdminHeader), { ssr: false })

export { NonSSRHeader as AdminHeader }
