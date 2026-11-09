import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Bonkverse docs (docs.bonkverse.io): the platform-wide docs site from
// RFC-0001. Today it holds the public API guide (/api/); platform docs
// (architecture, RFCs, ADRs, the bonk.io reference) move here next.
// The API itself lives in Bonkverse/bonkverse (public_api/); a PR there that
// changes /api/v1/ links its matching PR here.

const config: Config = {
  title: 'Bonkverse Docs',
  tagline: 'Docs for the Bonkverse platform and API',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://docs.bonkverse.io',
  baseUrl: '/',

  organizationName: 'Bonkverse',
  projectName: 'docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Bonkverse/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/planet.png',
    colorMode: {
      // Bonkverse is a dark site; the docs match it.
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Bonkverse Docs',
      logo: {
        alt: 'Bonkverse',
        src: 'img/planet.png',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'api', position: 'left', label: 'API'},
        {to: '/api/endpoints/bulk-lookup', label: 'Endpoints', position: 'left'},
        {href: 'https://bonkverse.io', label: 'bonkverse.io', position: 'right'},
        {href: 'https://replays.bonkverse.io', label: 'Replays', position: 'right'},
        {href: 'https://github.com/Bonkverse', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      links: [
        {
          title: 'API',
          items: [
            {label: 'Quickstart', to: '/api/quickstart'},
            {label: 'Errors', to: '/api/errors'},
            {label: 'Changelog', to: '/api/changelog'},
          ],
        },
        {
          title: 'Bonkverse',
          items: [
            {label: 'bonkverse.io', href: 'https://bonkverse.io'},
            {label: 'Replays', href: 'https://replays.bonkverse.io'},
            {label: 'Discord', href: 'https://discord.gg/2Zx7Cwhr4Z'},
          ],
        },
      ],
      copyright: 'Bonkverse is a fan project and is not affiliated with bonk.io.',
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
