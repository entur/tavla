import { Heading1, Paragraph } from '@entur/typography'
import { CopyText } from 'Admin/components/CopyText'
import classes from './styles.module.css'

function ShareTable({ text }: { text: string }) {
    return (
        <div>
            <Heading1 className={classes.heading}>Del avgangstavlen</Heading1>
            <Paragraph className={classes.paragraph}>
                Trykk på knappen for å kopiere linken til avgangstavlen.
            </Paragraph>
            <CopyText text={text} toastText="Kopiert lenke" />
        </div>
    )
}

export { ShareTable }
