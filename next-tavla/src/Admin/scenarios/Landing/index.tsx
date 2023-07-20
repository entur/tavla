import { Button } from '@entur/button'
import { Heading1, ListItem, Paragraph, UnorderedList } from '@entur/typography'
import classes from './styles.module.css'
import { addBoardSettings } from 'utils/firebase'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import landingImage from './Scenariolanding.png'
import tavla from './tavla.png'

function Landing() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleCreateNewBoard() {
        setLoading(true)
        const createdBoard = await addBoardSettings({
            tiles: [],
        })
        await router.push('/edit/' + createdBoard.id)
    }

    return (
        <div className={classes.container}>
            <div className={classes.top}>
                <div>
                    <Heading1>Lag din egen avgangstavle</Heading1>
                    <Heading1 className={classes.highlightText}>
                        for reisende
                    </Heading1>

                    <Button
                        className={classes.button}
                        onClick={handleCreateNewBoard}
                        variant="primary"
                        disabled={loading}
                        loading={loading}
                    >
                        Opprett ny tavle
                    </Button>
                </div>
                <div className={classes.illustrationImage}>
                    <Image
                        src={landingImage}
                        alt="illustration"
                        width={402}
                        height={377}
                    />
                </div>
            </div>

            <div className={classes.bottom}>
                <div className={classes.img}>
                    <Image
                        src={tavla}
                        alt="illustration"
                        className={classes.tavlaImg}
                    />
                </div>

                <div className={classes.bottomText}>
                    <Heading1 className={classes.text}>Hva er Tavla?</Heading1>

                    <Paragraph className={classes.text}>
                        Tavla er en nettside som viser avgangene til all
                        offentlig transport i Norge. Med Tavla kan du enkelt
                        sette opp en avgangstavle fra de stoppestedene du ønsker
                        å se, i sanntid.
                    </Paragraph>
                    <Paragraph className={classes.text}>
                        Du kan f.eks. lage avgangstavler for:
                    </Paragraph>
                    <UnorderedList className={classes.list}>
                        <ListItem>holdeplasser</ListItem>
                        <ListItem>knutepunkter</ListItem>
                    </UnorderedList>
                    <Paragraph className={classes.text}>
                        Ved å samle og tydeliggjøre viktig informasjon på ett
                        sted kan Tavla gjøre det enklere for reisende å bruke
                        det kollektivtrafikktilbudet som finnes.
                    </Paragraph>
                    <Paragraph className={classes.text}>
                        Hver avgangstavle er knyttet til en lenke som kan brukes
                        til å sende eller vise den fram der det passer deg.
                        Trykk på “Opprett ny tavle” for å teste det ut!
                    </Paragraph>
                </div>
            </div>
        </div>
    )
}
export { Landing }
