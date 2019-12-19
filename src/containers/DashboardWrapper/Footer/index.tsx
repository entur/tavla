import React, { useState, useCallback } from 'react'
import { Heading3, Paragraph } from '@entur/typography'
import { ActionChip } from '@entur/chip'
import { EditIcon, SettingsIcon, CheckIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Button } from '@entur/button'

import { useSettingsContext } from '../../../settings'
import BackButton from '../../../components/backButton/BackButton'

import './styles.scss'

const SHOW_DASHBOARD_PANEL = !window.location.origin.includes('tavla.en-tur.no')

function RadioBox({
    value, selected, onChange, children,
}): JSX.Element {
    const id = `radio-${value}`

    return (
        <label className={`radiobox ${selected ? 'radiobox--checked' : ''}`} htmlFor={id}>
            <div className={`radiobox__checkmark ${selected ? 'radiobox__checkmark--checked' : '' }`}>
                { selected ? <CheckIcon size="large" /> : null }
            </div>
            <input
                id={id}
                type="radio"
                value={value}
                onChange={onChange}
                checked={selected}
            />
            { children }
        </label>
    )
}

function Footer({ className, history }: Props): JSX.Element {
    const [settings, { setDashboard }] = useSettingsContext()

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [choice, setChoice] = useState<string>(settings.dashboard || '')

    const goBack = useCallback(() => {
        history.push('/')
    }, [history])

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    const onChange = useCallback((event) => {
        event.preventDefault()
        setChoice(event.target.value)
    }, [])

    const submit = useCallback((event) => {
        event.preventDefault()
        setModalOpen(false)
        setDashboard(choice, { persist: true })
    }, [choice, setDashboard])

    return (
        <footer className={`footer ${className || ''}`}>
            <BackButton className="footer__back-button" action={goBack}/>
            <div className="footer__actions">
                { SHOW_DASHBOARD_PANEL ? (
                    <ActionChip onClick={(): void => setModalOpen(true)}>
                        <EditIcon /> Endre visning
                    </ActionChip>
                ) : null }
                <ActionChip onClick={onSettingsButtonClick}>
                    <SettingsIcon /> Rediger tavla
                </ActionChip>
            </div>
            <Modal
                size="small"
                open={modalOpen}
                title="Endre visning"
                onDismiss={(): void => setModalOpen(false)}
            >
                <Paragraph>Her kan du velge mellom forskjellige visninger.</Paragraph>
                <form onSubmit={submit}>
                    <RadioBox value="" selected={choice === ''} onChange={onChange}>
                        <Heading3>Kompakt</Heading3>
                        <Paragraph>De tre neste avgangene til en linje vises på samme rad.</Paragraph>
                    </RadioBox>
                    <RadioBox value="Chrono" selected={choice === 'Chrono'} onChange={onChange}>
                        <Heading3>Kronologisk</Heading3>
                        <Paragraph>Hver avgang får sin egen rad.</Paragraph>
                    </RadioBox>
                    <RadioBox value="Timeline" selected={choice === 'Timeline'} onChange={onChange}>
                        <Heading3>Tidslinja</Heading3>
                        <Paragraph>Avgangene ruller mot høyre mot målet. Ikke egnet for bysykkel.</Paragraph>
                    </RadioBox>
                    <div className="footer-modal__buttons">
                        <Button variant="primary" type="submit">Lagre valg</Button>
                        <Button variant="secondary" type="button" onClick={(): void => setModalOpen(false)}>Avbryt</Button>
                    </div>
                </form>
            </Modal>
        </footer>
    )
}

interface Props {
    className?: string,
    history: any,
    onSettingsButtonClick: any,
}

export default Footer
