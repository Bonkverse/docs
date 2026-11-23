// The Bonkverse Appearance menu and account link for the docs navbar, matching
// the shared header on bonkverse.io and replays.bonkverse.io.
import React, {useEffect, useRef, useState, type ReactNode} from 'react';
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
    BonkverseTheme?: {
      get(): string;
      set(theme: string): void;
      season?(): string | null;
      setSeasonal?(on: boolean): void;
    };
  }
}

type ItemProps = {mobile?: boolean};

/** The saved theme, kept in step with Docusaurus's own light/dark mode
 * (Light shows Docusaurus's light mode). */
function useBvTheme(): string {
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

  return theme;
}

/** Whether seasonal themes are on (Bonkverse/ui seasons.css). */
function useBvSeasonal(): boolean {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(window.BonkverseTheme?.season?.() != null);
    const onChange = (e: Event) => setOn((e as CustomEvent<{season: string | null}>).detail.season != null);
    document.addEventListener('bv:seasonchange', onChange);
    return () => document.removeEventListener('bv:seasonchange', onChange);
  }, []);

  return on;
}

function ThemeSelect({className}: {className?: string}): ReactNode {
  const theme = useBvTheme();
  return (
    <select className={className} value={theme} onChange={(e) => window.BonkverseTheme?.set(e.target.value)}>
      {THEMES.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

/** "Seasonal theme": the package's CSS shows it only while a season is on
 * the calendar; the choice is shared with every Bonkverse site. */
function SeasonToggle({className}: {className?: string}): ReactNode {
  const on = useBvSeasonal();
  return (
    <label className={clsx('bv-season-toggle', className)}>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => window.BonkverseTheme?.setSeasonal?.(e.target.checked)}
      />
      <span>Seasonal theme</span>
    </label>
  );
}

// Lucide's palette (ISC licence).
function PaletteIcon(): ReactNode {
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
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z" />
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    </svg>
  );
}

/**
 * Appearance: as on bonkverse.io and the replay site, one palette button in
 * the navbar whose menu holds the theme and, in season, the seasonal switch
 * (Bonkverse/ui .bv-appearance). In the phone menu the two sit in the list.
 */
export function AppearanceMenu({mobile}: ItemProps): ReactNode {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (mobile) {
    return (
      <>
        <li className="menu__list-item">
          <label className={clsx('bv-theme-picker', styles.picker, styles.mobile)}>
            <span>Theme</span>
            <ThemeSelect />
          </label>
        </li>
        <li className="menu__list-item">
          <SeasonToggle className={styles.mobile} />
        </li>
      </>
    );
  }

  return (
    <div className="navbar__item bv-dropdown bv-appearance" ref={box}>
      <button
        className="navbar__link"
        type="button"
        aria-expanded={open}
        aria-controls="bv-appearance"
        aria-label="Appearance"
        onClick={() => setOpen(!open)}>
        <PaletteIcon />
      </button>
      <div className="bv-menu bv-menu--end bv-appearance__menu" id="bv-appearance" hidden={!open}>
        <label className="bv-appearance__field">
          <span>Theme</span>
          <ThemeSelect className="bv-input bv-select" />
        </label>
        <SeasonToggle />
      </div>
    </div>
  );
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
