// Adds the Bonkverse Appearance menu and account link to the navbar item
// types (used as `custom-bvAppearance` and `custom-bvAccount` in
// docusaurus.config.ts).
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import {AppearanceMenu, AccountLink} from '@site/src/components/BonkverseNav';

export default {
  ...ComponentTypes,
  'custom-bvAppearance': AppearanceMenu,
  'custom-bvAccount': AccountLink,
};
