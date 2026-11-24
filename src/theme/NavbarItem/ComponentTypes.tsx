// Adds the Bonkverse Appearance menu, account menu and header menus (Tools)
// to the navbar item types (used as `custom-bvAppearance`, `custom-bvAccount`
// and `custom-bvMenu` in docusaurus.config.ts).
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import {AppearanceMenu, AccountLink, NavMenu} from '@site/src/components/BonkverseNav';

export default {
  ...ComponentTypes,
  'custom-bvAppearance': AppearanceMenu,
  'custom-bvAccount': AccountLink,
  'custom-bvMenu': NavMenu,
};
