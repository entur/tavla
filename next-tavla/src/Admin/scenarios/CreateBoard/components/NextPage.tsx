import { PrimaryButton } from '@entur/button'
import { TCreatePage } from 'Admin/types/createBoard'

function NextPage({
    nextPage,
    pushPage,
}: {
    nextPage: TCreatePage
    pushPage: (page: TCreatePage) => void
}) {
    return (
        <PrimaryButton className="w-30" onClick={() => pushPage(nextPage)}>
            Neste
        </PrimaryButton>
    )
}

export { NextPage }
