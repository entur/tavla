import { SVGProps } from 'react'
import classes from './styles.module.css'
import { TSituationFragment } from 'graphql/index'

function Situation({
    situation,
}: {
    situation: TSituationFragment | undefined
}) {
    const situationText =
        situation?.summary.find((summary) => summary.language === 'no')
            ?.value ??
        situation?.description.find((desc) => desc.language === 'no')?.value ??
        situation?.summary[0]?.value ??
        situation?.description[0]?.value ??
        null

    if (!situationText) return null

    return (
        <div className={classes.situation}>
            <div className={classes.validation}>
                <ValidationExclamation />
            </div>
            <div className={classes.situationText}>{situationText}</div>
        </div>
    )
}

function ValidationExclamation(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.5em"
            xmlSpace="preserve"
            viewBox="0 0 16 16"
            {...props}
        >
            <circle fill="transparent" cx={8} cy={8} r={4.4} />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.7 3h1.4v5.1H7.3V4zm.7 8.2c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9c0 .6-.4.9-.9.9z"
            />
        </svg>
    )
}

export { Situation }
