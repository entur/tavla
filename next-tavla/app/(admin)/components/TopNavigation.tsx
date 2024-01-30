'use client'

import { TopNavigationItem } from '@entur/menu'
import { Login } from './Login'
import classes from '../admin.module.css'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-blue.svg'

function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    return (
        <div className={classes.pageContainer}>
            <div className="flexRow justifyBetween alignCenter p-4">
                <Link href="/">
                    <Image src={TavlaLogo} height={32} alt="" />
                </Link>
                <div className="flexRow g-4">
                    {loggedIn && (
                        <>
                            <TopNavigationItem as={Link} href="/boards">
                                Tavler
                            </TopNavigationItem>
                            <TopNavigationItem as={Link} href="/organizations">
                                Organisasjoner
                            </TopNavigationItem>
                        </>
                    )}
                    <Login loggedIn={loggedIn} />
                </div>
            </div>
        </div>
    )
}

export { TopNavigation }
