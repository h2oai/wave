module.exports = {
  title: 'H2O Wave',
  tagline: 'Realtime Web Apps and Dashboards for Python',
  url: 'https://h2oai.github.io/wave/',
  baseUrl: '/wave/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'h2oai', // Usually your GitHub org/user name.
  projectName: 'wave', // Usually your repo name.
  plugins: [
    [
      require.resolve('docusaurus-gtm-plugin'),
      {
        id: 'GTM-TTFP7BH', // GTM Container ID
      }
    ]
  ],
  themeConfig: {
    prism: {
      additionalLanguages: ['toml'],
    },
    navbar: {
      title: 'H2O Wave',
      logo: {
        alt: 'H2O Wave',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/examples', label: 'Gallery', position: 'left' },
        { to: 'docs/getting-started', label: 'Get Started', position: 'left', },
        { to: 'docs/guide', label: 'Guide', position: 'left', },
        { to: 'docs/enterprise', label: 'Enterprise', position: 'left', },
        { to: 'docs/api/index', label: 'API', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'https://github.com/h2oai/wave/releases', label: 'Download', position: 'right', },
        { href: 'https://github.com/h2oai/wave', label: 'GitHub', position: 'right', },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Gallery',
              to: 'docs/examples',
            },
            {
              label: 'Get Started',
              to: 'docs/getting-started',
              activeBasePath: 'docs',
            },
            {
              label: 'Guide',
              to: 'docs/guide',
            },
            {
              label: 'Enterprise',
              to: 'docs/enterprise',
            },
            {
              label: 'API',
              to: 'docs/api/index',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discuss',
              href: 'https://h2owave.h2o.ai/',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/h2o-wave',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/h2o_wave',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'Download',
              href: 'https://github.com/h2oai/wave/releases',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/h2oai/wave',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href='https://h2o.ai' style='color:#ffe52b'>H2O.ai</a>, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/h2oai/wave/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // TODO
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
