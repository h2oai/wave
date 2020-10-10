module.exports = {
  title: 'H2O Q',
  tagline: 'From the makers of H2O',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/qd/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'h2oai', // Usually your GitHub org/user name.
  projectName: 'q', // Usually your repo name.
  themeConfig: {
    //    prism: {
    //      theme: require('prism-react-renderer/themes/nightOwlLight'),
    //    },
    navbar: {
      title: 'H2O Q',
      logo: {
        alt: 'H2O Q',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/examples', label: 'Gallery', position: 'left' },
        { to: 'docs/getting-started', label: 'Get Started', position: 'left', },
        { to: 'docs/guide', label: 'Guide', position: 'left', },
        { to: 'docs/enterprise', label: 'Enterprise', position: 'left', },
        { to: 'docs/api/index', label: 'API', position: 'left' },
        // TODO
        // { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'https://github.com/h2oai/qd/releases/latest', label: 'Download', position: 'right', },
        { href: 'https://github.com/h2oai/qd', label: 'GitHub', position: 'right', },
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
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/h2oq',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/h2oq',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/h2oai',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: 'blog',
            // },
            {
              label: 'Download',
              href: 'https://github.com/h2oai/qd/releases/latest',
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
          editUrl: 'https://github.com/h2oai/qd/edit/master/website/',
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
