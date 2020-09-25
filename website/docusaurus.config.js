module.exports = {
  title: 'H2O Q',
  tagline: 'Realtime web apps and dashboards for Python',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'h2oai', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'H2O Q',
      logo: {
        alt: 'H2O Q',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'gallery/', label: 'Gallery', position: 'left' },
        { to: 'docs/', activeBasePath: 'docs', label: 'Docs', position: 'left', },
        { to: 'examples/', label: 'Examples', position: 'left' },
        { to: 'api/', label: 'API', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'https://github.com/h2oai/qd', label: 'Download', position: 'right', },
        { href: 'https://github.com/h2oai/qd', label: 'GitHub', position: 'right', },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/h2oq',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/h2oq',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
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
              label: 'GitHub',
              href: 'https://github.com/h2oai/qd',
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
          // Please change this to your repo.
          editUrl:
            'https://github.com/h2oai/qd/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/h2oai/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
