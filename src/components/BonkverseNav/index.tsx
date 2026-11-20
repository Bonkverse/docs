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
type Account = {username: string; avatar: string | null};

// Lucide's circle-user (ISC licence), shown under the skin picture and when
// there is none, as in the shared header on the other sites.
function UserIcon(): ReactNode {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

/**
 * Your bonkverse.io account (its session cookie covers .bonkverse.io): your
 * name and worn skin from /api/me/, or Log in.
 */
export function AccountLink({mobile}: ItemProps): ReactNode {
  const [account, setAccount] = useState<Account | null>(null);
  const [here, setHere] = useState('https://docs.bonkverse.io/');

  useEffect(() => {
    setHere(window.location.href);
    let live = true;
    fetch(`${SITE}/api/me/`, {credentials: 'include'})
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (live && data?.authenticated) {
          setAccount({username: data.user.username, avatar: data.user.avatar ?? null});
        }
      })
      .catch(() => null); // signed out, offline or not allowed: show Log in
    return () => {
      live = false;
    };
  }, []);

  const href = account
    ? `${SITE}/player/${encodeURIComponent(account.username)}/`
    : `${SITE}${nav.account.signedOut.href}?next=${encodeURIComponent(here)}`;
  const link = (
    <a className={clsx(mobile ? 'menu__link' : 'navbar__item navbar__link', account && styles.account)} href={href}>
      {account &&
        (account.avatar ? (
          // Their worn skin, as on bonkverse.io's header; the icon underneath
          // shows if the picture can't load.
          <span
            className={styles.avatar}
            style={{'--skin': `url("${account.avatar}")`} as React.CSSProperties}
            aria-hidden="true">
            <UserIcon />
          </span>
        ) : (
          <UserIcon />
        ))}
      {account?.username ?? nav.account.signedOut.label}
    </a>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
}
