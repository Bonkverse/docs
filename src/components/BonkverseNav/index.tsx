// The Bonkverse theme picker and account link for the docs navbar, matching
// the shared header on bonkverse.io and replays.bonkverse.io.
import React, {useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {useColorMode} from '@docusaurus/theme-common';
import nav from '@bonkverse/ui/nav.json';
import styles from './styles.module.css';

const SITE = 'https://bonkverse.io';
const THEMES: [string, string][] = [
  ['bonkverse', 'Bonkverse'],
  ['light', 'Bonkverse Light'],
  ['dark', 'Bonkverse Dark'],
];

// Set by Bonkverse/ui's theme.js, inlined into <head> (docusaurus.config.ts).
declare global {
  interface Window {
    BonkverseTheme?: {get(): string; set(theme: string): void};
  }
}

type ItemProps = {mobile?: boolean};

/** The three Bonkverse themes; Light shows Docusaurus's light mode. */
export function ThemePicker({mobile}: ItemProps): ReactNode {
  const {setColorMode} = useColorMode();
  const [theme, setTheme] = useState('bonkverse');

  useEffect(() => {
    const sync = (next: string) => {
      setTheme(next);
      setColorMode(next === 'light' ? 'light' : 'dark');
    };
    sync(window.BonkverseTheme?.get() ?? 'bonkverse');
    const onChange = (e: Event) => sync((e as CustomEvent<{theme: string}>).detail.theme);
    document.addEventListener('bv:themechange', onChange);
    return () => document.removeEventListener('bv:themechange', onChange);
  }, [setColorMode]);

  const picker = (
    <label className={clsx('bv-theme-picker', !mobile && 'navbar__item', styles.picker, mobile && styles.mobile)}>
      <span>Theme</span>
      <select
        value={theme}
        onChange={(e) => window.BonkverseTheme?.set(e.target.value)}
      >
        {THEMES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
  return mobile ? <li className="menu__list-item">{picker}</li> : picker;
}

/** Your bonkverse.io account (its session cookie covers .bonkverse.io). */
export function AccountLink({mobile}: ItemProps): ReactNode {
  const [username, setUsername] = useState<string | null>(null);
  const [here, setHere] = useState('https://docs.bonkverse.io/');

  useEffect(() => {
    setHere(window.location.href);
    let live = true;
    fetch(`${SITE}/api/me/`, {credentials: 'include'})
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (live && data?.authenticated) setUsername(data.user.username);
      })
      .catch(() => null); // signed out, offline or not allowed: show Log in
    return () => {
      live = false;
    };
  }, []);

  const href = username
    ? `${SITE}/player/${encodeURIComponent(username)}/`
    : `${SITE}${nav.account.signedOut.href}?next=${encodeURIComponent(here)}`;
  const link = (
    <a className={mobile ? 'menu__link' : 'navbar__item navbar__link'} href={href}>
      {username ?? nav.account.signedOut.label}
    </a>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
}
