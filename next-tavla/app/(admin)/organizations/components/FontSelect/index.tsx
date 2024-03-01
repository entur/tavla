'use client'
import { Button } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { FontChoiceChip } from 'app/(admin)/edit/[id]/components/MetaSettings/FontChoiceChip'

function FontSelect({
    oid,
    font,
}: {
    oid?: TOrganizationID
    font?: TFontSize
}) {
    return (
        <div>
            <Heading3>Størrelse på tavlevisningen</Heading3>
            <div className={classes.container}>
                <Paragraph>
                    Tavlevisningen kan vises i ulike størrelser. Her kan du
                    velge hva som skal være standard til tavlevisningen når du
                    setter opp en ny tavle.
                </Paragraph>
                <form
                    className="flexColumn g-1"
                    action={async (data: FormData) => {
                        const font = data.get('font') as TFontSize
                        if (!oid) return
                        await setFontSize(oid, font)
                    }}
                >
                    <FontChoiceChip font={font ?? 'medium'} />

                    <div className="flexRow justifyEnd mt-2 mr-2 ">
                        <Button
                            variant="secondary"
                            type="submit"
                            aria-label="Lagre tekststørrelse"
                        >
                            Lagre tekststørrelse
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { FontSelect }
