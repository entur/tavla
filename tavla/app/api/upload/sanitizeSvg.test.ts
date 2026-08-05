import { describe, expect, it } from 'vitest'
import { sanitizeSvg } from './sanitizeSvg'

describe('sanitizeSvg', () => {
    it('fjerner <script>-tagger', () => {
        const result = sanitizeSvg('<svg><script>alert(1)</script></svg>')
        expect(result).not.toContain('<script')
        expect(result).not.toContain('alert')
    })

    it('fjerner event handler-attributter som onload', () => {
        const result = sanitizeSvg(
            '<svg onload="alert(1)"><circle r="4"/></svg>',
        )
        expect(result).not.toContain('onload')
        expect(result).not.toContain('alert')
    })

    it('fjerner javascript: URI-er i xlink:href', () => {
        const result = sanitizeSvg(
            '<svg><image xlink:href="javascript:alert(1)"/></svg>',
        )
        expect(result).not.toContain('javascript:')
    })

    it('fjerner <foreignObject> med script-injeksjon', () => {
        const result = sanitizeSvg(
            '<svg><foreignObject><script>alert(1)</script></foreignObject></svg>',
        )
        expect(result).not.toContain('<script')
        expect(result).not.toContain('alert')
    })

    it('beholder trygt SVG-innhold uendret', () => {
        const safeSvg =
            '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="red"></circle></svg>'
        const result = sanitizeSvg(safeSvg)
        expect(result).toContain('<circle')
        expect(result).toContain('fill="red"')
        expect(result).toContain('viewBox="0 0 10 10"')
    })
})
