'use client'
import { Heading2, Paragraph, SubParagraph } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import { Title } from 'app/_components/TableSettings/Title'
import { WalkingDistance } from 'app/_components/TableSettings/WalkingDistance'
import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import type { TFormFeedback } from 'app/(innlogget)/utils/forms'
import { useCallback, useRef, useState } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { Copy } from '../../rediger/components/Buttons/Copy'
import { Open } from '../../rediger/components/Buttons/Open'
import { CustomUrl } from '../../rediger/components/CustomUrl/CustomUrl'
import { saveIdentity } from '../actions'

/**
 * Gathers everything that defines the board as a whole — its name, where it is
 * shown (location) and its link — in one place (problem #3, grep C). Name and
 * location share one form wired to the partial `saveIdentity` action.
 */
function IdentityPanel({
    board,
    boardLink,
}: {
    board: BoardDB
    boardLink: string
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [nameFeedback, setNameFeedback] = useState<
        TFormFeedback | undefined
    >()

    const handleChange = useCallback(async () => {
        if (!formRef.current) return
        const result = await saveIdentity(new FormData(formRef.current))
        setNameFeedback(
            result?.error
                ? {
                      form_type: 'name',
                      variant: 'negative',
                      feedback: result.error,
                  }
                : undefined,
        )
    }, [])

    const linkBid = board.customUrl ?? board.id

    return (
        <section className="flex flex-col gap-4 rounded-md bg-tintLight px-4 py-6">
            <Heading2 margin="none">Tavle</Heading2>
            <form ref={formRef} className="flex flex-col gap-4">
                <HiddenInput id="bid" value={board.id} />
                <Title
                    title={board.meta?.title ?? DEFAULT_BOARD_NAME}
                    feedback={nameFeedback}
                    onBlur={handleChange}
                />
                <div>
                    <Paragraph margin="none">Lenke til denne tavla:</Paragraph>
                    <div className="flex flex-wrap items-center gap-2">
                        <Paragraph
                            margin="none"
                            className="border rounded px-2 py-1 font-mono bg-white break-all"
                        >
                            {boardLink}
                        </Paragraph>
                        <CustomUrl bid={board.id} customUrl={board.customUrl} />
                        <Copy
                            bid={linkBid}
                            type="icon"
                            trackingLocation="board_page"
                        />
                        <Open
                            bid={linkBid}
                            type="icon"
                            trackingLocation="board_page"
                        />
                    </div>
                </div>
                <WalkingDistance
                    location={board.meta.location}
                    onChange={handleChange}
                />
            </form>
            {board.isArrivals !== undefined && (
                <SubParagraph className="m-0">
                    Viser: {board.isArrivals ? 'Ankomster' : 'Avganger'}
                </SubParagraph>
            )}
        </section>
    )
}

export { IdentityPanel }
