/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Markdown styles
            '--tw-prose-body': 'var(--wave-text)', // Text
            '--tw-prose-headings': 'var(--wave-text)', // Headings
            '--tw-prose-lead': 'var(--wave-text)', // TODO: Not sure what this is.
            '--tw-prose-links': 'var(--wave-text)', // Links
            '--tw-prose-bold': 'var(--wave-text)', // Bold text
            '--tw-prose-counters': 'var(--wave-text8)', // Numbered list
            '--tw-prose-bullets': 'var(--wave-text2)', // Bullet list
            '--tw-prose-hr': 'var(--wave-text1)', // Horizontal line
            '--tw-prose-quotes': 'var(--wave-text)', // Quote text
            '--tw-prose-quote-borders': 'var(--wave-text2)', // Quote border
            '--tw-prose-captions': 'var(--wave-text7)', // Image caption
            '--tw-prose-pre-bg': '#282b2e', // Code pre block background - TODO: Use single source of truth for this.
            '--tw-prose-th-borders': 'var(--wave-text4)', // Table header bottom border
            '--tw-prose-td-borders': 'var(--wave-text2)', // Table cell bottom border
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

