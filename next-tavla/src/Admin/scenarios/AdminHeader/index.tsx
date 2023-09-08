import TavlaLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { Login } from 'Admin/scenarios/Login'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import dynamic from 'next/dynamic'

function AdminHeader({ user }: { user: DecodedIdToken | null }) {
    return (
        <div className={classes.header}>
            <Image
                src={TavlaLogo}
                alt="Entur Tavla logo"
                width={117}
                height={20}
                className={classes.logo}
            />
            <Login user={user} />
        </div>
    )
}

const NonSSRHeader = dynamic(() => Promise.resolve(AdminHeader), { ssr: false })

export { NonSSRHeader as AdminHeader }
