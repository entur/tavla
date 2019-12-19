import React, { useState, useCallback } from 'react'
import { Heading3, Paragraph } from '@entur/typography'
import { ActionChip } from '@entur/chip'
import { EditIcon, SettingsIcon, CheckIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Button } from '@entur/button'
import { colors } from '@entur/tokens'

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
                { selected ? <CheckIcon color={colors.brand.blue} size="extra-large" /> : null }
            </div>
            <input
                id={id}
                type="radio"
                value={value}
                onChange={onChange}
                checked={selected}
            />
            <div className="radiobox__children">
                { children }
            </div>
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
                <Paragraph>Velg visningen du ønsker for Tavla.</Paragraph>
                <form onSubmit={submit}>
                    <RadioBox value="" selected={choice === ''} onChange={onChange}>
                        <Heading3 margin="none">Kompakt</Heading3>
                        <Paragraph>De tre neste avgangene til en linje vises på samme rad.</Paragraph>
                    </RadioBox>
                    <RadioBox value="Chrono" selected={choice === 'Chrono'} onChange={onChange}>
                        <Heading3 margin="none">Kronologisk</Heading3>
                        <Paragraph>Hver avgang vises på en egen rad.</Paragraph>
                    </RadioBox>
                    <RadioBox value="Timeline" selected={choice === 'Timeline'} onChange={onChange}>
                        <Heading3 margin="none">Tidslinja</Heading3>
                        <Paragraph>En visuell fremvisning der avgangene beveger seg mot stoppet. Ikke egnet for bysykkel.</Paragraph>
                    </RadioBox>
                    <div className="footer-modal__buttons">
                        <Button variant="secondary" type="button" onClick={(): void => setModalOpen(false)}>Avbryt</Button>
                        <Button variant="primary" type="submit">Lagre valg</Button>
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
