module.exports = {
    plugins: ['stylelint-scss'],
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
    rules: {
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extend',
                    'at-root',
                    'debug',
                    'warn',
                    'error',
                    'if',
                    'else',
                    'for',
                    'each',
                    'while',
                    'mixin',
                    'include',
                    'content',
                    'return',
                    'function',
                    'use',
                ],
            },
        ],
        'selector-pseudo-class-no-unknown': [
            true,
            {
                // global and local are used in css-modules
                ignorePseudoClasses: ['global', 'local'],
            },
        ],
        'no-descending-specificity': [true, { severity: 'warning' }],
        'selector-class-pattern': null,
        'shorthand-property-no-redundant-values': null,
        'color-function-notation': 'legacy',
        // This should be turned on if we remove all vendor-prefixes
        'property-no-vendor-prefix': null,
        'alpha-value-notation': 'number',
        'declaration-block-no-redundant-longhand-properties': [
            true,
            {
                ignoreShorthands: ['flex-flow'],
            },
        ],
        // Needs to be disabled when using stylelint-scss
        'function-no-unknown': null,
        'scss/function-no-unknown': [
            true,
            {
                // Check if we can delete these rules when Slider/styles.scss is deleted
                ignoreFunctions: ['var', '-webkit-gradient', 'color-stop'],
            },
        ],
        'import-notation': 'string',
    },
}
