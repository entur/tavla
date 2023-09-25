import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import { Login } from 'Admin/scenarios/Login'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import dynamic from 'next/dynamic'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import classes from './styles.module.css'
import { CreateBoard } from '../CreateBoard'
import { UserIcon } from '@entur/icons'

function AdminHeader({
    user,
    options,
}: {
    user: DecodedIdToken | null
    options: ('create' | 'boards')[]
}) {
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
                {user && (
                    <div className={classes.buttons}>
                        {options.includes('create') && (
                            <CreateBoard icon={true} />
                        )}
                        {options.includes('boards') && (
                            <PrimaryButton as={Link} href="/edit/boards">
                                Mine Tavler
                                <UserIcon />
                            </PrimaryButton>
                        )}
                    </div>
                )}
                <Login user={user} />
            </div>
        </div>
    )
}

const NonSSRHeader = dynamic(() => Promise.resolve(AdminHeader), { ssr: false })

export { NonSSRHeader as AdminHeader }
