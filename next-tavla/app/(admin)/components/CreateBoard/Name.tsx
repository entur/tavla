'use client'

import { TextField } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'

function Name() {
    return (
        <div className="flexColumn">
            <Heading4 className="mt-1">Sett navn på tavla</Heading4>
            <Paragraph>
                Navnet på tavla vil vises i listen over tavler. Du kan endre på
                navnet senere.
            </Paragraph>
            <TextField
                size="medium"
                label="Navn tavla"
                id="name"
                name="name"
                required
            />
        </div>
    )
}

export { Name }
