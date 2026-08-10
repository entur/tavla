import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

export function sanitizeSvg(svgContent: string): string {
    const window = new JSDOM('').window
    const DOMPurify = createDOMPurify(window)
    return DOMPurify.sanitize(svgContent)
}
