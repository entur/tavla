import * as Sentry from '@sentry/nextjs'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import Error from 'next/error'

const CustomErrorComponent: NextPage<ErrorProps> = (props) => {
    return <Error statusCode={props.statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData) => {
    await Sentry.captureUnderscoreErrorException(contextData)
    return Error.getInitialProps(contextData)
}

export default CustomErrorComponent
