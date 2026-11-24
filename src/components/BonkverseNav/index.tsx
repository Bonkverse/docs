// The Bonkverse Appearance menu and account link for the docs navbar, matching
// the shared header on bonkverse.io and replays.bonkverse.io.
import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {useColorMode} from '@docusaurus/theme-common';
import nav from '@bonkverse/ui/nav.json';
import {
  addAccountHref,
  getMe,
  otherAccounts,
  signInHref,
  switchAccount,
  type BonkverseMe,
} from '@bonkverse/ui/account.mjs';
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
 * Open/close for a navbar menu, as Bonkverse/ui's ui.js does for the shared
 * header: one menu open at a time, a click outside or Escape closes it, and
 * Escape puts focus back on its button.
 */
const MENU_OPENED = 'bv-navbar-menu-opened';

function useNavbarMenu(id: string) {
  const [open, setOpenState] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (next) window.dispatchEvent(new CustomEvent(MENU_OPENED, {detail: id}));
  };

  useEffect(() => {
    const onOther = (e: Event) => (e as CustomEvent<string>).detail !== id && setOpenState(false);
    window.addEventListener(MENU_OPENED, onOther);
    return () => window.removeEventListener(MENU_OPENED, onOther);
  }, [id]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpenState(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenState(false);
      button.current?.focus();
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return {open, setOpen, box, button};
}

/**
 * Appearance: as on bonkverse.io and the replay site, one palette button in
 * the navbar whose menu holds the theme and, in season, the seasonal switch
 * (Bonkverse/ui .bv-appearance). In the phone menu the two sit in the list.
 */
export function AppearanceMenu({mobile}: ItemProps): ReactNode {
  const {open, setOpen, box, button} = useNavbarMenu('bv-appearance');

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
        ref={button}
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

// Lucide's chevron-down (ISC licence). `bv-chevron`: the shared CSS turns
// it when its button's menu is open.
function ChevronIcon(): ReactNode {
  return (
    <svg
      className="bv-chevron"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Their worn skin, as on bonkverse.io's header; the icon underneath shows
 * if the picture can't load. */
function Avatar({src}: {src: string | null}): ReactNode {
  return src ? (
    <span className={styles.avatar} style={{'--skin': `url("${src}")`} as React.CSSProperties} aria-hidden="true">
      <UserIcon />
    </span>
  ) : (
    <UserIcon />
  );
}

/** The account menu's links from nav.json. Log out is a POST with
 * bonkverse.io's CSRF token, so it stays on bonkverse.io's own menu. */
function menuLinks(here: string): {label: string; href: string}[] {
  return nav.account.items
    .filter((item: {method?: string}) => item.method !== 'post')
    .map((item: {label: string; href: string; id?: string}) => ({
      label: item.label,
      href: item.id === 'add-account' ? addAccountHref(here) : `${SITE}${item.href}`,
    }));
}

/**
 * The person's other bonk.io accounts (RFC-0003 phase 5). Those signed in on
 * this browser switch in place: bonkverse.io's session covers this site too,
 * so the page reloads as the new account. The others go to bonkverse.io's
 * login with their name filled in.
 */
function Switcher({me, here, mobile}: {me: BonkverseMe; here: string; mobile?: boolean}): ReactNode {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const others = otherAccounts(me);
  if (!others.length) return null;

  const pick = async (id: number) => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    const result = await switchAccount(id);
    if (result.ok) {
      window.location.reload();
      return;
    }
    setBusy(false);
    setMessage(result.message);
  };

  const itemClass = mobile ? clsx('menu__link', styles.mobileItem) : 'bv-menu__item';
  const rows = others.map((account) => {
    const label = (
      <>
        <UserIcon />
        <span className="bv-menu__text">{account.username}</span>
        {account.signed_in && !account.connected && (
          <span className="bv-menu__badge" title="Wear will ask for this account's bonk.io password">
            Not connected
          </span>
        )}
        {!account.signed_in && <span className="bv-menu__badge">Sign in</span>}
      </>
    );
    const row = account.signed_in ? (
      <button className={itemClass} type="button" disabled={busy} onClick={() => pick(account.id)}>
        {label}
      </button>
    ) : (
      <a className={itemClass} href={signInHref(account.username, here)}>
        {label}
      </a>
    );
    return mobile ? (
      <li className="menu__list-item" key={account.id}>
        {row}
      </li>
    ) : (
      <React.Fragment key={account.id}>{row}</React.Fragment>
    );
  });

  const status = message ? (
    <p className={clsx('bv-menu__label', mobile && styles.mobile)} role="status">
      {message}
    </p>
  ) : null;

  if (mobile) {
    return (
      <>
        <li className={clsx('menu__list-item', 'bv-menu__label', styles.mobile)}>Switch account</li>
        {rows}
        {status && <li className="menu__list-item">{status}</li>}
      </>
    );
  }
  return (
    <>
      <div className="bv-menu__label">Switch account</div>
      {rows}
      {status}
      <div className="bv-menu__divider" />
    </>
  );
}

/**
 * Your bonkverse.io account (its session cookie covers .bonkverse.io): your
 * name and worn skin from /api/me/ (Bonkverse/ui's account.mjs), and the
 * account menu as on bonkverse.io and the replay site: your other bonk.io
 * accounts to switch to, then My profile, Settings, API keys and Add
 * account. Signed out: Log in.
 */
export function AccountLink({mobile}: ItemProps): ReactNode {
  const [me, setMe] = useState<BonkverseMe | null>(null);
  const [here, setHere] = useState('https://docs.bonkverse.io/');
  const {open, setOpen, box, button} = useNavbarMenu('bv-account');

  useEffect(() => {
    setHere(window.location.href);
    let live = true;
    getMe().then((found) => live && setMe(found)); // null: signed out, offline or not allowed
    return () => {
      live = false;
    };
  }, []);

  const account = me?.user ?? null;
  const href = account
    ? `${SITE}/player/${encodeURIComponent(account.username)}/`
    : `${SITE}${nav.account.signedOut.href}?next=${encodeURIComponent(here)}`;
  const link = (
    <a className={clsx(mobile ? 'menu__link' : 'navbar__link', account && styles.account)} href={href}>
      {account && <Avatar src={account.avatar} />}
      {account?.username ?? nav.account.signedOut.label}
    </a>
  );

  if (!account || !me) {
    return mobile ? (
      <li className="menu__list-item">{link}</li>
    ) : (
      <div className="navbar__item">{link}</div>
    );
  }

  if (mobile) {
    // The phone menu lists everything in place.
    return (
      <>
        <li className="menu__list-item">{link}</li>
        <Switcher me={me} here={here} mobile />
        {menuLinks(here).map((item) => (
          <li className="menu__list-item" key={item.href}>
            <a className="menu__link" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </>
    );
  }

  return (
    <div className="navbar__item bv-dropdown bv-header__account" ref={box}>
      {link}
      <button
        ref={button}
        className="navbar__link"
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-controls="bv-account"
        onClick={() => setOpen(!open)}>
        <ChevronIcon />
      </button>
      <div className="bv-menu bv-menu--end" id="bv-account" hidden={!open}>
        <Switcher me={me} here={here} />
        {menuLinks(here).map((item) => (
          <a className="bv-menu__item" key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

type NavMenuProps = ItemProps & {
  label: string;
  items: {label: string; href: string}[];
};

/**
 * A header menu from nav.json (Tools), as in the shared header on the other
 * sites: a button with a chevron that turns when open, and the package's
 * .bv-menu that rises into place. Opens on click, not hover. In the phone
 * menu it opens in place in the list.
 */
export function NavMenu({label, items, mobile}: NavMenuProps): ReactNode {
  const id = `bv-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const {open, setOpen, box, button} = useNavbarMenu(id);

  if (mobile) {
    return (
      <li className="menu__list-item">
        <button
          className={clsx('menu__link', styles.mobileItem)}
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}>
          <span className="bv-menu__text">{label}</span>
          <ChevronIcon />
        </button>
        <ul className="menu__list" id={id} hidden={!open}>
          {items.map((item) => (
            <li className="menu__list-item" key={item.href}>
              <a className="menu__link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <div className="navbar__item bv-dropdown" ref={box}>
      <button
        ref={button}
        className="navbar__link"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}>
        {label} <ChevronIcon />
      </button>
      <div className="bv-menu" id={id} hidden={!open}>
        {items.map((item) => (
          <a className="bv-menu__item" key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
