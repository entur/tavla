import Head from 'next/head'

function TavlaHead({
    title,
    description,
}: {
    title: string
    description?: string
}) {
    return (
        <Head>
            <title>{title} | Entur Tavla</title>
            {description && <meta name="description" content={description} />}
        </Head>
    )
}

export default TavlaHead
