import {readFileSync} from 'node:fs';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {NavbarItem} from '@docusaurus/theme-common';
import nav from '@bonkverse/ui/nav.json';

// Bonkverse docs (docs.bonkverse.io): the platform-wide docs site from
// RFC-0001. Today it holds the public API guide (/api/); platform docs
// (architecture, RFCs, ADRs, the bonk.io reference) move here next.
// The API itself lives in Bonkverse/bonkverse (public_api/); a PR there that
// changes /api/v1/ links its matching PR here.
//
// The look comes from Bonkverse/ui (RFC-0002): its color tokens, Jost, and
// the header and footer links in its nav.json, shared with bonkverse.io and
// replays.bonkverse.io. Bump the version in package.json to take a new
// release.

const SITE = 'https://bonkverse.io';
const THIS_SITE = 'docs.bonkverse.io';
const siteHref = (href: string) => (href.startsWith('/') ? SITE + href : href);

// Bonkverse/ui's theme.js sets data-bv-theme (Bonkverse, Light or Dark) from
// the choice saved on .bonkverse.io before the page paints. The line after
// it gives Docusaurus the matching light or dark mode, which its own script
// reads next. "</script" inside the file's comments would end the tag early.
const themeScript =
  readFileSync(require.resolve('@bonkverse/ui/theme.js'), 'utf8').replace(/<\/script/gi, '<\\/script') +
  `
try {
  localStorage.setItem('theme', document.documentElement.getAttribute('data-bv-theme') === 'light' ? 'light' : 'dark');
} catch (e) {}
`;

const headerItems: NavbarItem[] = nav.header.map((item): NavbarItem => {
  if ('items' in item && item.items) {
    // Opens on click with the shared header's chevron and menu, not
    // Docusaurus's hover dropdown (src/components/BonkverseNav NavMenu).
    return {
      type: 'custom-bvMenu',
      label: item.label,
      position: 'left',
      items: item.items.map((sub) => ({label: sub.label, href: siteHref(sub.href)})),
    } as NavbarItem;
  }
  if ('site' in item && item.site === THIS_SITE) {
    // This site's own item: highlighted on every docs page.
    return {to: '/', label: item.label, position: 'left', activeBaseRegex: '.*'};
  }
  return {href: siteHref(item.href as string), label: item.label, position: 'left'};
});

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

  headTags: [{tagName: 'script', attributes: {}, innerHTML: themeScript}],

  // Serves the package's logo at /logo.png, the same file the other
  // Bonkverse sites show.
  staticDirectories: ['static', 'node_modules/@bonkverse/ui/img'],

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
          customCss: [
            require.resolve('@bonkverse/ui/tokens.css'),
            require.resolve('@bonkverse/ui/components.css'),
            require.resolve('@bonkverse/ui/seasons.css'),
            './src/css/jost.css',
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'logo.png',
    colorMode: {
      // Follows the Bonkverse theme in the navbar's Appearance menu (Light → light, the
      // others → dark); Docusaurus's own toggle is hidden
      // (src/theme/ColorModeToggle).
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: nav.brand.label,
      logo: {
        alt: '',
        src: 'logo.png',
        href: nav.brand.href,
        target: '_self',
        width: 30,
        height: 30,
      },
      items: [
        ...headerItems,
        {type: 'custom-bvAppearance', position: 'right'},
        {type: 'custom-bvAccount', position: 'right'},
      ],
    },
    footer: {
      links: [
        {
          title: 'API docs',
          items: [
            {label: 'Quickstart', to: '/api/quickstart'},
            {label: 'Errors', to: '/api/errors'},
            {label: 'Changelog', to: '/api/changelog'},
          ],
        },
        ...nav.footer.map((column) => ({
          title: column.title,
          items: column.items.map((link) => ({label: link.label, href: siteHref(link.href)})),
        })),
      ],
      copyright: nav.note,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
