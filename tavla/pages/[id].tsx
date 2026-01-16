import type { GetServerSidePropsContext } from 'next'
import { resolveVisTavlaBaseUrl } from 'utils/boardLink'

const BOARD_ID_PATTERN = /^\w{20}$/ // Matches a 20 character alphanumeric string

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>,
) {
    const id = context.params?.id ?? ''

    if (!BOARD_ID_PATTERN.test(id)) {
        return { notFound: true }
    }

    const host = context.req?.headers.host ?? ''
    const targetBase = resolveVisTavlaBaseUrl({ host })
    const destination = new URL(context.resolvedUrl, targetBase).toString()

    return {
        redirect: {
            destination,
            permanent: false, //Change to true when we are sure all is working
            statusCode: 302, //Change to 301 when we are sure all is working
        },
    }
}

export default function BoardRedirect() {
    return null
}
