module.exports = {
  title: 'H2O Wave',
  tagline: 'Realtime Web Apps and Dashboards for Python',
  url: 'https://wave.h2o.ai',
  baseUrl: '/',
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
      additionalLanguages: ['toml', 'r'],
    },
    algolia: {
      appId: '1DCIS06TYN',
      apiKey: '6c848d14efe3428564d69ff571b0f223',
      indexName: 'wave',
      contextualSearch: true,
    },
    navbar: {
      title: 'H2O Wave',
      logo: {
        alt: 'H2O Wave',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/getting-started', label: 'Get Started', position: 'left', },
        { to: 'docs/guide', label: 'Guide', position: 'left', },
        { to: 'docs/widgets/overview', label: 'Widgets', position: 'left' },
        { to: 'docs/examples', label: 'Examples', position: 'left', },
        { to: 'docs/api/index', label: 'API', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'https://github.com/h2oai/wave/discussions', label: 'Discuss', position: 'left' },
        { to: 'https://h2oai.github.io/h2o-ai-cloud/', label: 'Enterprise', position: 'left', },
        { to: 'https://github.com/h2oai/wave/releases', label: 'Download', position: 'right', },
        { href: 'https://github.com/h2oai/wave',
          position: 'right',
          className: 'navbar-icon',
          'aria-label': 'GitHub repository',
          html: `<img src="/img/github.svg" alt='Github Logo' />`,},
        {
          href: 'https://discord.gg/V8GZFAy3WM',
          position: 'right',
          className: 'navbar-icon',
          'aria-label': 'Discord channel',
          html: `<img src="/img/discord.svg" alt= 'Discord Logo' />`,
        },
        {
          href: 'https://twitter.com/intent/follow?screen_name=h2o_wave',
          position: 'right',
          className: 'navbar-icon',
          'aria-label': 'Twitter page',
          html: `<img src="/img/twitter.svg" alt='Twitter Logo'/>`,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Get Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Guide',
              to: 'docs/guide',
            },
            {
              label: 'Widgets',
              to: 'docs/widgets/overview',
            },
            {
              label: 'Examples',
              to: 'docs/examples',
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
              href: 'https://github.com/h2oai/wave/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/h2o-wave',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/h2o_wave',
            },
            {
              label: 'Code of Conduct',
              href: 'https://github.com/h2oai/wave/blob/master/.github/CODE_OF_CONDUCT.md',
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
              label: 'Enterprise',
              to: 'https://h2oai.github.io/h2o-ai-cloud/',
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
      copyright: `Copyright © ${new Date().getFullYear()} <a href='https://h2o.ai' style='color:#ffe52b'>H2O.ai</a>, Inc. Licensed under the <a href='https://github.com/h2oai/wave/blob/master/LICENSE' style='color:#ffe52b'>Apache License 2.0</a>.`,
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
  scripts: [
    {
      src: '/fix-location.js',
      async: false,
      defer: false,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.1067.0/aws-sdk.min.js',
      async: false,
      defer: false,
    },
  ],
}
