'use client'
import { Heading2, Heading3 } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import {
    getFormFeedbackForField,
    InputType,
    TFormFeedback,
} from 'app/(admin)/utils'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useCallback, useRef, useState } from 'react'
import { TBoard, TFolder } from 'types/settings'
import { saveSettings } from './actions'
import { Folder } from './components/Folder'
import { FontSelect } from './components/FontSelect'
import { Footer } from './components/Footer'
import { ThemeSelect } from './components/ThemeSelect'
import { Title } from './components/Title'
import { TransportPaletteSelect } from './components/TransportPaletteSelect'
import { ViewType } from './components/ViewType'
import { WalkingDistance } from './components/WalkingDistance'

function Settings({ board, folder }: { board: TBoard; folder?: TFolder }) {
    const [formErrors, setFormErrors] = useState<
        Partial<Record<InputType, TFormFeedback>>
    >({})

    const formRef = useRef<HTMLFormElement | null>(null)

    const submitSettings = useCallback(async () => {
        const formData = formRef?.current

        if (!formData) return
        const data = new FormData(formData)

        const resultingErrors = await saveSettings(data)
        setFormErrors(resultingErrors ?? {})
    }, [])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-background px-2 py-2 md:px-6 md:py-8">
            <Heading2>Innstillinger</Heading2>
            <FormError
                {...getFormFeedbackForField('general', formErrors.general)}
            />
            <form className="flex flex-col gap-6 lg:flex-row" ref={formRef}>
                <div className="box shrink">
                    <Heading3 margin="bottom"> Generelt </Heading3>
                    <div className="flex flex-col gap-4">
                        <Title
                            title={board.meta?.title ?? DEFAULT_BOARD_NAME}
                            feedback={getFormFeedbackForField(
                                'name',
                                formErrors.name,
                            )}
                            onBlur={submitSettings}
                        />
                        <Folder folder={folder} onChange={submitSettings} />
                        <WalkingDistance
                            location={board.meta.location}
                            onChange={submitSettings}
                        />
                        <Footer
                            infoMessage={board.footer}
                            onBlur={submitSettings}
                        />
                    </div>
                </div>
                <div className="box md:min-w-[480px]">
                    <Heading3 margin="bottom">Tavlevisning </Heading3>
                    <div className="flex flex-col gap-4">
                        <ViewType
                            hasCombinedTiles={
                                board.combinedTiles ? true : false
                            }
                            onChange={submitSettings}
                        />
                        <FontSelect
                            font={board.meta.fontSize}
                            onChange={submitSettings}
                        />
                        <ThemeSelect
                            theme={board.theme}
                            onChange={submitSettings}
                        />
                        <TransportPaletteSelect
                            transportPalette={board.transportPalette}
                            theme={board.theme ?? 'dark'}
                            onChange={submitSettings}
                        />

                        <HiddenInput id="bid" value={board.id} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export { Settings }
