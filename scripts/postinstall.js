const fs = require('fs')

const FONT_FOLDER = 'node_modules/@entur/fonts'
const FONT_INDEX_FILE = `${FONT_FOLDER}/index.css`

if (!fs.existsSync(FONT_INDEX_FILE)) {
    fs.mkdirSync(FONT_FOLDER, { recursive: true })
    fs.closeSync(fs.openSync(FONT_INDEX_FILE, 'w'))
}
