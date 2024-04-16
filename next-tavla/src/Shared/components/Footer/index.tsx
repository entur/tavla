import Image from 'next/image'
import EnturLogo from 'assets/logos/entur/Enturlogo_White.svg'

function Footer() {
    return (
        <footer className="flex flex-row justify-start items-center text-2xl">
            <span>Tjenesten leveres av</span>
            <Image src={EnturLogo} alt="Entur logo" height={70} />
        </footer>
    )
}

export { Footer }
