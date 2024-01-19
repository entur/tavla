import classes from './styles.module.css'
import Image from 'next/image'
import TavlaLogo from 'assets/logos/Tavla-white.svg'
import { Heading3, Link as EnturLink } from '@entur/typography'
import Link from 'next/link'

function Footer() {
    return (
        <div className={classes.footer}>
            <Image src={TavlaLogo} alt="" />
            <div className="flexRow justifyBetween alignCenter">
                <div>
                    <Heading3>Entur AS</Heading3>
                </div>
                <div>
                    <Heading3>Entur AS</Heading3>
                </div>
                <div>
                    <Heading3>Entur AS</Heading3>
                    <EnturLink as={Link} href="/">
                        ts
                    </EnturLink>
                </div>
            </div>
        </div>
    )
}

export { Footer }
