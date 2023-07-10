import { TTransportMode } from 'types/graphql-schema'
import { SVGProps } from 'react'
import classes from './styles.module.css'
import { TColors, getPresentation } from 'Board/utils/colors'
import { TDepartureFragment } from 'graphql/index'

function TransportIcon({ departure }: { departure: TDepartureFragment }) {
    const mode = departure.serviceJourney.transportMode
        ? departure.serviceJourney.transportMode
        : 'unknown'

    const presentation = getPresentation(
        departure.serviceJourney.line.presentation,
        departure.serviceJourney.id,
        departure.serviceJourney.transportMode,
    )

    return getTransportIcon(mode, presentation)
}

function getTransportIcon(
    transportMode: TTransportMode,
    presentation: TColors,
) {
    switch (transportMode) {
        case 'metro':
            return (
                <MetroIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'bus':
            return (
                <BusIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'air':
            return (
                <PlaneIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'tram':
            return (
                <TramIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'funicular':
            return (
                <FunicularIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'cableway':
            return (
                <CablewayIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'rail':
            return (
                <RailIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'coach':
            return (
                <BusIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'lift':
            return (
                <CablewayIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'monorail':
            return (
                <RailIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'trolleybus':
            return (
                <BusIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        case 'water':
            return (
                <FerryIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
        default:
            return (
                <UnknownIcon
                    className={classes.transportIcon}
                    fill={presentation.backgroundColor}
                />
            )
    }
}

export function MetroIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.004 5v1.166h2.412V12h1.168V6.166h2.415V5z"
            />
            <path d="M8 2c3.308 0 6 2.692 6 6s-2.692 6-6 6c-3.309 0-6-2.692-6-6s2.691-6 6-6m0-1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z" />
        </svg>
    )
}

export function BusIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <g fillRule="evenodd" clipRule="evenodd">
                <path d="M10.5 11.8a1 1 0 1 1 1.998.003A1 1 0 0 1 10.5 11.8z" />
                <path d="m14.996 9.595-.7-4.296A.353.353 0 0 0 13.95 5H1.7c-.35 0-.7.358-.7.717V10.642c0 .178.128.358.3.358h1.547c.236-.719.906-1.2 1.703-1.2s1.468.481 1.703 1.2h3.544c.236-.719.906-1.2 1.703-1.2s1.467.481 1.703 1.2h1.447c.193 0 .35-.161.35-.358v-.988c0-.02-.002-.04-.004-.06zm-2.84-2.805c0-.198.158-.358.35-.358h1.087a.35.35 0 0 1 .347.311l.185 1.432a.36.36 0 0 1-.085.282.343.343 0 0 1-.262.122h-1.272a.354.354 0 0 1-.35-.358V6.79zm-4.2 0c0-.198.157-.358.35-.358h2.8c.193 0 .35.16.35.358V8.22a.354.354 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358V6.79zm-4.2 0c0-.198.157-.358.35-.358h2.8c.194 0 .351.16.351.358V8.22a.355.355 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358V6.79zm-2.1 0c0-.198.158-.358.35-.358h.701c.193 0 .349.16.349.358V8.22a.353.353 0 0 1-.349.358h-.7a.354.354 0 0 1-.35-.358V6.79z" />
                <path d="M3.55 11.8c0-.551.449-1 1-1s1 .449 1 1a1 1 0 0 1-2 0z" />
            </g>
        </svg>
    )
}

export function PlaneIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.833 5.682a.216.216 0 0 0-.044-.03l-.016-.011-.043-.025c-.146-.084-1.008-.42-1.478-.576a.761.761 0 0 0-.398-.024L9.037 6.044 5.21 4.438c-.273-.118-.318-.14-.57-.125l-.794.076c-.171.018-.198.158-.055.294L6.01 6.858 3.621 7.5l-2.13-.824c-.176-.069-.231-.068-.323-.043l-.08.022c-.063.016-.09.056-.088.1.002.057.046.076.19.228 0 0 2.873 2.805 3.033 2.948a.221.221 0 0 0 .204.048l10.138-2.731a.219.219 0 0 0 .151-.144c.131-.4.313-1.058.28-1.179a.458.458 0 0 0-.163-.243zm-1.252.206-.271.073c-.03.008-.074.026-.122.006l-.46-.169a.139.139 0 0 1-.087-.138.141.141 0 0 1 .103-.127l.271-.073a.142.142 0 0 1 .088.005l.506.204c.056.023.086.055.082.115s-.052.09-.11.104zM2 11.999h12v1H2z"
            />
        </svg>
    )
}

export function HelicopterIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 4.671V4H4v.671h5.17v1.127h-.52a.65.65 0 0 0-.65.65v.554H2.558l-.315-.863a.21.21 0 0 0-.2-.139h-.832A.211.211 0 0 0 1 6.211l.009 1.907a.212.212 0 0 0 .176.206L8 9.475v.875c0 .359.291.65.65.65h4.7a.65.65 0 0 0 .65-.65V9.198c0-1.875-1.526-3.4-3.4-3.4h-.76V4.67H15zm-4.638 2.242v-.097a.229.229 0 0 1 .221-.19h.526c.891 0 1.631.66 1.76 1.516.014.083.01.128-.012.17-.03.051-.084.085-.21.085-.195 0-.888-.002-2.064 0a.22.22 0 0 1-.221-.22V6.913zM9 11.999h4v1H9z"
            />
        </svg>
    )
}

export function TramIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.062 5.272a.35.35 0 0 0-.341-.273H8.566l1.289-.89c.1-.075.149-.133.149-.255a.332.332 0 0 0-.142-.276L8.368 2.399h-.964l1.701 1.434-1.7 1.166H2.28a.35.35 0 0 0-.341.273L1.009 9.38a.451.451 0 0 0 .074.35l.812 1.124a.35.35 0 0 0 .283.145h11.643a.35.35 0 0 0 .284-.145l.812-1.123a.451.451 0 0 0 .074-.351l-.929-4.108zM3.75 8.182a.35.35 0 0 1-.35.35H2.35a.35.35 0 0 1-.342-.426l.31-1.4a.35.35 0 0 1 .34-.275H3.4a.35.35 0 0 1 .35.35v1.4zm3.5 0a.35.35 0 0 1-.35.35H4.799a.35.35 0 0 1-.35-.35V6.78a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.51 0a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.35-.35V6.78a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.073.219a.35.35 0 0 1-.272.131H11.81a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35H13.251a.35.35 0 0 1 .342.275l.309 1.4a.347.347 0 0 1-.07.295zM2 11.999h12v1H2z"
            />
        </svg>
    )
}

export function FunicularIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.062 5.273A.35.35 0 0 0 13.721 5H2.279a.35.35 0 0 0-.341.273L1.009 9.38a.451.451 0 0 0 .074.35l.812 1.124a.35.35 0 0 0 .283.145h11.643a.35.35 0 0 0 .284-.145l.812-1.123a.451.451 0 0 0 .074-.351l-.929-4.108zM3.75 8.183a.35.35 0 0 1-.35.35H2.35a.35.35 0 0 1-.342-.426l.31-1.4a.35.35 0 0 1 .34-.275H3.4a.35.35 0 0 1 .35.35v1.4zm3.5 0a.35.35 0 0 1-.35.35H4.799a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.51 0a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.073.219a.35.35 0 0 1-.272.131H11.81a.35.35 0 0 1-.35-.35V6.782a.35.35 0 0 1 .35-.35H13.251a.35.35 0 0 1 .342.275l.309 1.4a.347.347 0 0 1-.07.295zM2 12h12v1H2z"
            />
        </svg>
    )
}

export function CablewayIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="m13.295 1.803-3.917.984a1.225 1.225 0 0 0-.188-.806L13.094 1l.201.803Zm-5.127.121a.74.74 0 1 1 0 1.482.74.74 0 0 1 0-1.482Zm5.011 6.011a.432.432 0 0 0-.42-.336h-9.18a.432.432 0 0 0-.422.336l-1.146 5.068a.557.557 0 0 0 .09.433l1.003 1.385a.432.432 0 0 0 .35.179h9.429a.432.432 0 0 0 .35-.179l1.002-1.385a.556.556 0 0 0 .09-.433L13.18 7.935ZM5.49 11.502c0 .24-.193.433-.432.433H3.763a.432.432 0 0 1-.422-.526l.382-1.727a.43.43 0 0 1 .42-.34h.915c.239 0 .432.194.432.433v1.727Zm4.494 0a.432.432 0 0 1-.432.433H6.961a.432.432 0 0 1-.432-.432V9.775c0-.238.193-.432.432-.432h2.591c.238 0 .432.194.432.432v1.728Zm2.927.272a.432.432 0 0 1-.337.162h-1.295a.432.432 0 0 1-.433-.433V9.775c0-.238.194-.432.432-.432h.914a.43.43 0 0 1 .422.34l.381 1.727a.431.431 0 0 1-.084.364ZM6.959 2.54l-3.918.984.202.803 3.904-.98a1.225 1.225 0 0 1-.188-.807Zm1.623 1.273v1.724h1.43v.828H6.324v-.828h1.43V3.814c.13.047.268.084.414.084.147 0 .284-.037.414-.084Z"
            />
        </svg>
    )
}

export function TaxiIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.998 7.233h-.002l-1.092-3.337c-.168-.512-.685-.863-1.272-.863H9.5v-.502a.498.498 0 0 0-.498-.498H6.997a.498.498 0 0 0-.497.498v.502H4.364c-.587 0-1.104.35-1.272.862L1.996 7.233h-.002a.998.998 0 0 0-.998.999v3.503c0 .275.223.498.499.498h.501v.667a1.1 1.1 0 0 0 2.2 0v-.667h7.6v.667a1.1 1.1 0 0 0 2.2 0v-.667h.501a.499.499 0 0 0 .5-.498V8.232a.998.998 0 0 0-1-.999zM3.266 7.167l.84-2.74a.51.51 0 0 1 .495-.344h6.79c.23 0 .431.141.494.345l.84 2.739c.011.033-.016.066-.054.066H3.32c-.037 0-.065-.033-.055-.066zm-.47 1.066c.44.002.8.36.8.804a.8.8 0 1 1-.8-.804zm10.4 1.6a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
            />
        </svg>
    )
}

export function BicycleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.51 3.97a.453.453 0 0 0-.432-.324h-2.14v.7h1.95l.01.035.625 2.12-4.528.503-.357-.629h.313a.375.375 0 0 0 0-.75h-1.6a.375.375 0 0 0 0 .75h.482l.523.92-1.971 3.803a.349.349 0 0 0 .62.32l1.761-3.4 1.505 2.65.608-.344-1.508-2.657 3.708-.412L8 10.479l.589.38 2.208-3.428 1.143 3.877a.35.35 0 1 0 .67-.198l-2.1-7.14z"
            />
            <path d="M7.977 10.65a.35.35 0 1 1 0 .7.35.35 0 0 1 0-.7m0-.65a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12.327 9.45c1.048 0 1.9.852 1.9 1.9s-.852 1.9-1.9 1.9-1.9-.852-1.9-1.9.852-1.9 1.9-1.9m0-.75a2.65 2.65 0 1 0 0 5.3 2.65 2.65 0 0 0 0-5.3zM3.627 9.45c1.048 0 1.9.852 1.9 1.9s-.852 1.9-1.9 1.9-1.9-.852-1.9-1.9.852-1.9 1.9-1.9m0-.75a2.65 2.65 0 1 0 0 5.3 2.65 2.65 0 0 0 0-5.3z" />
        </svg>
    )
}

export function WalkIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <g fillRule="evenodd" clipRule="evenodd">
                <path d="M8.663 3.5a1.25 1.25 0 1 1 0-2.499 1.25 1.25 0 0 1 0 2.499zM5.92 11.39l-.048.102-1.744 2.55a.6.6 0 1 0 .963.716l1.905-2.297c.06-.104.116-.206.175-.31l.519-1.485-1.205-1.153-.564 1.878z" />
                <path d="m12.791 7.79-2.026-1.244a.203.203 0 0 1-.064-.063l-.98-1.702a1 1 0 0 0-.644-.438l-1.44-.29a1 1 0 0 0-.797.18L5.04 5.582a1 1 0 0 0-.288.34L3.671 8.017a.428.428 0 0 0 .724.456l1.293-1.996a.197.197 0 0 1 .063-.061l1.088-.666-.309 1.533a2.294 2.294 0 0 0 .596 2.043l2.276 2.288.045.07 1.115 2.912a.6.6 0 1 0 1.137-.384l-.805-2.874-.155-.32-1.854-2.545a.347.347 0 0 1-.06-.272l.374-1.857.687.871a1 1 0 0 0 .348.28l2.12 1.03a.428.428 0 0 0 .437-.735z" />
            </g>
        </svg>
    )
}

export function RailIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M1 12h13v1H1z" />
            <path d="M14.75 8.1a.623.623 0 0 0-.091-.11l-.035-.036a5.537 5.537 0 0 1-.093-.095c-.315-.314-2.34-1.805-3.436-2.528-.358-.236-.76-.331-.999-.331h-3.54l1.295-.89c.1-.076.149-.134.149-.256a.332.332 0 0 0-.142-.276L6.364 2.399H5.4l1.702 1.434-1.7 1.166h.001H1v6h12.612c.196 0 .38-.098.488-.263.49-.755.9-1.41.9-1.902 0-.277-.095-.529-.25-.735zm-2.537-.508c-.046.136-.173.172-.317.172h-.666c-.071 0-.185.01-.284-.063l-.95-.671a.332.332 0 0 1 .2-.599h.666c.072 0 .142.024.2.068l1.034.778c.115.086.162.18.117.315z" />{' '}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.062 5.273A.35.35 0 0 0 13.721 5H2.279a.35.35 0 0 0-.341.273L1.009 9.38a.451.451 0 0 0 .074.35l.812 1.124a.35.35 0 0 0 .283.145h11.643a.35.35 0 0 0 .284-.145l.812-1.123a.451.451 0 0 0 .074-.351l-.929-4.108zM3.75 8.183a.35.35 0 0 1-.35.35H2.35a.35.35 0 0 1-.342-.426l.31-1.4a.35.35 0 0 1 .34-.275H3.4a.35.35 0 0 1 .35.35v1.4zm3.5 0a.35.35 0 0 1-.35.35H4.799a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.51 0a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.073.219a.35.35 0 0 1-.272.131H11.81a.35.35 0 0 1-.35-.35V6.782a.35.35 0 0 1 .35-.35H13.251a.35.35 0 0 1 .342.275l.309 1.4a.347.347 0 0 1-.07.295zM2 12h12v1H2z"
            />
        </svg>
    )
}

export function FerryIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path d="M8.737 13c-.824 0-1.253-.226-1.632-.425-.33-.173-.591-.31-1.168-.31s-.838.137-1.168.31c-.38.2-.81.425-1.633.425-1.052 0-1.969-.588-2.007-.613L1 12.316l.447-.894.196.108c.037.023.743.47 1.493.47.577 0 .838-.137 1.168-.31.38-.199.81-.424 1.633-.424s1.254.225 1.633.424c.33.173.59.31 1.167.31s.837-.137 1.167-.31c.379-.199.81-.424 1.632-.424.643 0 1.046.137 1.372.292l-.479.88c-.23-.103-.48-.172-.893-.172-.577 0-.837.136-1.168.31-.378.198-.808.424-1.631.424zM14.75 7.456h-1.432a.053.053 0 0 1-.05-.036l-.907-2.746a.348.348 0 0 0-.33-.242h-.554a.05.05 0 0 1-.047-.034l-.34-.825c-.073-.186-.214-.298-.417-.198l-1.213.706a.45.45 0 0 0-.244.402v.463c0 .04-.026.054-.047.054H5.78a.354.354 0 0 0-.318.198L4.362 7.422a.05.05 0 0 1-.047.034h-.667a.35.35 0 0 0-.314.195l-1.496 3.047c.313.16.658.302 1.275.302 1.4 0 1.4-.733 2.8-.733s1.4.733 2.8.733 1.4-.733 2.8-.733c.9 0 1.45.306 1.845.521l1.611-2.963a.25.25 0 0 0-.22-.37zm-7.353-.2a.2.2 0 0 1-.2.2H5.272c-.125 0-.236-.098-.133-.279l.381-.78a.254.254 0 0 1 .228-.141h1.45c.11 0 .2.09.2.2v.8zm2.204-.004a.204.204 0 0 1-.204.204H8.005a.204.204 0 0 1-.204-.204V6.46c0-.113.091-.204.204-.204h1.392c.113 0 .204.091.204.204v.792zm2.535.204-1.933.001A.202.202 0 0 1 10 7.256v-.799c0-.11.09-.201.202-.201h1.653c.116 0 .217.079.245.191l.193.78c.053.165-.049.229-.158.229z" />
        </svg>
    )
}

export function CarferryIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="m11.858 5.7-.703-2.145c-.108-.33-.44-.555-.818-.555H5.665c-.377 0-.71.225-.817.554L4.143 5.7h-.001a.642.642 0 0 0-.642.642v2.252c0 .177.144.32.32.32h.323v.429a.707.707 0 0 0 1.414 0v-.429h4.886v.429a.707.707 0 0 0 1.414 0v-.429h.322a.32.32 0 0 0 .321-.32V6.342a.642.642 0 0 0-.642-.642zM4.96 5.657l.54-1.76c.041-.132.17-.222.319-.222h4.364c.148 0 .278.09.318.221l.54 1.761c.007.022-.01.043-.035.043h-6.01c-.025 0-.042-.021-.036-.043zm-.302.686a.515.515 0 1 1 0 1.028.515.515 0 0 1 0-1.028zm6.686 1.028a.515.515 0 1 1 0-1.028.515.515 0 0 1 0 1.028z"
            />
            <path d="M2 12.289c.109-.015.231-.023.373-.023.576 0 .837.136 1.167.31.101.053.122.067.238.12.023.01.196.097.438.172.105.033.222.058.348.08.037.006.307.052.608.052.824 0 1.254-.226 1.633-.425.33-.173.591-.31 1.167-.31s.837.137 1.167.31c.38.2.81.425 1.633.425s1.253-.226 1.633-.425c.33-.173.59-.31 1.168-.31.145 0 .29.017.427.045v-1.013a2.99 2.99 0 0 0-.427-.031c-.823 0-1.253.225-1.633.424-.33.173-.59.31-1.168.31s-.838-.137-1.168-.31c-.379-.199-.809-.424-1.632-.424s-1.253.225-1.632.424c-.33.173-.59.31-1.168.31-.179 0-.326-.012-.454-.04-.094-.022-.192-.04-.322-.09a3.304 3.304 0 0 1-.392-.18c-.378-.199-.808-.424-1.631-.424a3.94 3.94 0 0 0-.373.017v1.006z" />
        </svg>
    )
}

export function MobilityIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            xmlSpace="preserve"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5 11c-.019 0-.036.005-.055.005l-2.224-7.68A.45.45 0 0 0 9.79 3H7.5v.8h1.95a.1.1 0 0 1 .097.072l1.53 5.281a.1.1 0 0 1-.02.093l-2.398 2.819a.1.1 0 0 1-.076.035H4.94A1.496 1.496 0 0 0 2 12.5a1.496 1.496 0 0 0 2.94.4H8.79a.45.45 0 0 0 .343-.159l2.224-2.615.324 1.12c-.41.267-.682.728-.682 1.254a1.5 1.5 0 1 0 1.5-1.5zm-9 2.2a.7.7 0 1 1 .002-1.402A.7.7 0 0 1 3.5 13.2zm9 0a.7.7 0 1 1 .002-1.402.7.7 0 0 1-.002 1.402z"
            />
        </svg>
    )
}

export function UnknownIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            {...props}
        >
            <path d="M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7zm0 3c1.405 0 2.61 1.205 2.61 2.61 0 1.134-.786 2.138-1.829 2.482l-.082.023v.74H7.301V8.518c0-.355.262-.647.603-.694L8 7.818c.632 0 1.21-.577 1.21-1.209S8.631 5.4 8 5.4c-.39 0-.833.292-1.086.698l-.07.125-.313.625-1.252-.625.313-.627C6.049 4.682 6.999 4 8 4zm.006 6.88a.875.875 0 110 1.75.875.875 0 010-1.75z"></path>
        </svg>
    )
}

export { TransportIcon }
