import { TBoard } from 'types/settings'
import { useAutoSaveSettings } from '../../hooks/useAutoSaveSettings'
import { Heading2, Heading5 } from '@entur/typography'
import { Checkbox } from '@entur/form'
import { IconButton } from '@entur/button'
import { SaveIcon } from '@entur/icons'
import { useState } from 'react'
import { Tooltip } from '@entur/tooltip'

function AutoSave({ board }: { board: TBoard }) {
    const [autoSave, setAutoSave] = useState(true)
    const { saveSettings, status } = useAutoSaveSettings(board, autoSave)
    const toggleAutoSave = () => setAutoSave(!autoSave)

    return (
        <div className="flexColumn">
            <Heading5 as={Heading2}>Autolagring</Heading5>
            <div className="flexRow justifyBetween">
                <Checkbox checked={autoSave} onChange={toggleAutoSave}>
                    {status}
                </Checkbox>
                {!autoSave && (
                    <Tooltip placement="bottom" content="Lagre">
                        <IconButton onClick={saveSettings}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}

export { AutoSave }
