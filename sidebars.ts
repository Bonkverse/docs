import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// One sidebar per section. The home page (docs/index.md) has none.
// Platform docs (architecture, RFCs, ADRs, bonk.io reference) get their own
// sidebar when they move here.
const sidebars: SidebarsConfig = {
  api: [
    'api/intro',
    'api/quickstart',
    {
      type: 'category',
      label: 'Using the API',
      collapsed: false,
      items: [
        'api/authentication',
        'api/rate-limits',
        'api/errors',
        'api/data-and-privacy',
        'api/versioning',
      ],
    },
    {
      type: 'category',
      label: 'Endpoints',
      collapsed: false,
      items: [
        'api/endpoints/me',
        'api/endpoints/player',
        'api/endpoints/level-history',
        'api/endpoints/bulk-lookup',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: ['api/guides/sync-a-leaderboard'],
    },
    'api/changelog',
  ],
};

export default sidebars;
