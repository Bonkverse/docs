// Adds the Bonkverse theme picker and account link to the navbar item types
// (used as `custom-bvTheme` and `custom-bvAccount` in docusaurus.config.ts).
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import {ThemePicker, SeasonToggle, AccountLink} from '@site/src/components/BonkverseNav';

export default {
  ...ComponentTypes,
  'custom-bvTheme': ThemePicker,
  'custom-bvSeason': SeasonToggle,
  'custom-bvAccount': AccountLink,
};
