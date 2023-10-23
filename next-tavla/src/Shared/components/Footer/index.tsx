import Image from 'next/image'
import EnturLogo from 'assets/logos/entur/Enturlogo_White.svg'

function Footer() {
    return (
        <footer className="flexRow justifyLeft alignCenter">
            <span style={{ fontSize: '1.25rem' }}>Tjenesten leveres av</span>
            <Image src={EnturLogo} alt="Entur logo" height={70} />
        </footer>
    )
}

export { Footer }
