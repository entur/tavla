import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'

function NotFound({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className="eds-contrast w-100 h-100 flexRow justifyCenter alignCenter">
            <div className="p-2">
                <div className={classes.enBomTur}>
                    <span>EN</span>
                    <span className={classes.middleText}>BOM</span>
                    <span>TUR</span>
                </div>
                <div className="textCenter">
                    <Heading1 className="text-rem-4 mt-2">{title}</Heading1>
                    <LeadParagraph className="text-rem-3">
                        {description}
                    </LeadParagraph>
                </div>
            </div>
        </div>
    )
}

export { NotFound }
