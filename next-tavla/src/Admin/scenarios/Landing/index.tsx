import { Button } from '@entur/button'
import { Heading1, ListItem, Paragraph, UnorderedList } from '@entur/typography'
import classes from './styles.module.css'
import { addBoardSettings } from 'utils/firebase'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import landingImage from 'assets/illustrations/Tavla-illustration.png'
import tavla from 'assets/illustrations/Tavla-screenshot.png'
import { Contrast } from '@entur/layout'
import classNames from 'classnames'

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
            <Contrast className={classes.centeredContainer}>
                <div className={classes.headingContainer}>
                    <Heading1>Lag din egen avgangstavle</Heading1>
                    <Heading1 className={classes.subheading}>
                        for reisende
                    </Heading1>

                    <Button
                        onClick={handleCreateNewBoard}
                        variant="primary"
                        disabled={loading}
                        loading={loading}
                        width="fluid"
                        className={classes.button}
                    >
                        Opprett ny tavle
                    </Button>
                </div>
                <div className={classNames(classes.content, classes.topImage)}>
                    <Image
                        src={landingImage}
                        alt="illustration"
                        className={classes.image}
                    />
                </div>
            </Contrast>
            <div className={classes.bottomContainer}>
                <div
                    className={classNames(
                        classes.centeredContainer,
                        classes.bottomContent,
                    )}
                >
                    <div className={classes.content}>
                        <Image
                            src={tavla}
                            alt="illustration"
                            className={classes.image}
                        />
                    </div>
                    <div className={classes.content}>
                        <Heading1>Hva er Tavla?</Heading1>

                        <Paragraph>
                            Tavla er en nettside som viser avgangene til all
                            offentlig transport i Norge. Med Tavla kan du enkelt
                            sette opp en avgangstavle fra de stoppestedene du
                            ønsker å se, i sanntid.
                        </Paragraph>
                        <Paragraph margin="none">
                            Du kan f.eks. lage avgangstavler for:
                        </Paragraph>
                        <UnorderedList className={classes.list}>
                            <ListItem>Holdeplasser</ListItem>
                            <ListItem>Knutepunkter</ListItem>
                        </UnorderedList>
                        <Paragraph>
                            Ved å samle og tydeliggjøre viktig informasjon på
                            ett sted kan Tavla gjøre det enklere for reisende å
                            bruke det kollektivtrafikktilbudet som finnes. Hver
                            avgangstavle er knyttet til en lenke som kan brukes
                            til å sende eller vise den fram der det passer deg.
                            Trykk på “Opprett ny tavle” for å teste det ut!
                        </Paragraph>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { Landing }
