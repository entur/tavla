'use client'
import { ChangeEventHandler, useRef, useState } from 'react'
import classes from './styles.module.css'
import { UploadIcon } from '@entur/icons'

function UploadElement() {
    const [file, setFile] = useState('')
    const [fileName, setFileName] = useState<string>()
    const input = useRef(null)

    const clearLogo = () => {
        setFile('')
        setFileName(undefined)
    }

    const setLogo: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target) return
        setFile(e.target.value)
        setFileName(e.target?.files?.item(0)?.name ?? 'Logo uten navn')
    }

    return (
        <div>
            <label htmlFor="logo" className={classes.upload}>
                <div className="flexColumn alignCenter g-2">
                    <Filename fileName={fileName} />
                </div>
            </label>
            <input
                ref={input}
                type="file"
                name="logo"
                accept="image/*"
                id="logo"
                style={{ display: 'none' }}
                onChange={setLogo}
                value={file}
                required
            />
            <div className="flexRow justifyBetween g-2 mt-2">
                <button
                    className="secondaryButton w-100 justifyCenter"
                    onClick={clearLogo}
                >
                    Avbryt
                </button>
                <button
                    type="submit"
                    onSubmit={clearLogo}
                    className="secondaryButton w-100 justifyCenter"
                >
                    Last opp logo
                </button>
            </div>
        </div>
    )
}

function Filename({ fileName }: { fileName?: string }) {
    if (fileName) return <div>{fileName}</div>

    return (
        <>
            <UploadIcon size={32} />
            Klikk her for å laste opp en logo
        </>
    )
}

export { UploadElement }
