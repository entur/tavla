import React from 'react'
import copy from 'copy-to-clipboard'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { LinkIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import classes from '../ShareTab.module.scss'

function BoardLink({ boardID }: { boardID: string }): JSX.Element {
    const { addToast } = useToast()

    return (
        <div className={classes.Link}>
            <Tooltip placement="bottom-right" content="Kopier lenke">
                <IconButton
                    className="share-page__link__button"
                    onClick={() => {
                        copy(`${window.location.host}/t/${boardID}`)
                        addToast({
                            title: 'Kopiert',
                            content:
                                'Linken har nå blitt kopiert til din utklippstavle.',
                            variant: 'success',
                        })
                    }}
                >
                    <LinkIcon className={classes.Icon} />
                    <span className={classes.Description}>
                        {`${window.location.host}/t/${boardID}`}
                    </span>
                </IconButton>
            </Tooltip>
        </div>
    )
}

export { BoardLink }
