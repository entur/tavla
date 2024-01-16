'use client'
import { TBoard } from 'types/settings'
import classes from './styles.module.css'
import { Heading1, Heading2 } from '@entur/typography'
import { TextField } from '@entur/form'
import { Board } from 'Board/scenarios/Board'
import { PrimaryButton } from '@entur/button'
import { useState } from 'react'
import { BannerAlertBox } from '@entur/alert'

function Edit({ board }: { board: TBoard }) {
    const [changed, setChanged] = useState(false)
    return (
        <div className="p-4">
            <Heading1>Rediger tavla: {board.meta?.title}</Heading1>
            <Heading2 className="pb-1">Forhåndsvisning</Heading2>
            {changed && (
                <BannerAlertBox variant="info" className="mb-4">
                    Du har endringer som ikke er lagret!
                </BannerAlertBox>
            )}
            <div className={classes.preview} data-theme={board.theme ?? 'dark'}>
                <Board board={board} />
            </div>
            <form onChange={() => setChanged(true)}>
                <TextField
                    defaultValue={board.meta?.title}
                    label="Navn på tavlen"
                    className="w-30"
                />
                <PrimaryButton>
                    {changed ? 'Lagre' : 'Ingen endringer'}
                </PrimaryButton>
            </form>
        </div>
    )
}

export { Edit }
