import { Heading2, Paragraph } from '@entur/typography'
import { CopyText } from 'Admin/components/CopyText'
import classes from './styles.module.css'

function ShareTable({ text }: { text: string }) {
    return (
        <div>
            <Heading2>Del avganstavla</Heading2>
            <Paragraph className={classes.paragraph}>
                Trykk på knappen for å kopiere linken til avganstavla og dele
                den med andre.
            </Paragraph>
            <CopyText text={text} toastText="Kopiert lenke" />
        </div>
    )
}

export { ShareTable }
