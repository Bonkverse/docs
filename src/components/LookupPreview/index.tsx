import type {ReactNode} from 'react';
import styles from './styles.module.css';

// The intro's one picture: a bulk lookup and what comes back, drawn like
// bonk.io's in-game player list (ball, name, level). Sample data.
type Row = {name: string; colour: string; level?: number; seen?: string; status?: string};

const ROWS: Row[] = [
  {name: 'Comet', colour: '#e84f4f', level: 87, seen: 'Nov 8'},
  {name: 'pebble', colour: '#9b6bff', status: 'private'},
  {name: 'marmot', colour: '#47d8c4', level: 64, seen: 'Nov 7'},
  {name: 'Tidepool', colour: '#ffc107', level: 71, seen: 'Nov 8'},
  {name: 'ghostie', colour: '#90b7ff', level: 58, seen: 'Oct 31'},
];

export default function LookupPreview(): ReactNode {
  return (
    <figure className={styles.preview} aria-label="Example: five players looked up in one request">
      <div className={styles.request}>
        <span className={styles.method}>POST</span>
        <code>/api/v1/lookup/players/</code>
      </div>
      <ul className={styles.list}>
        {ROWS.map((row) => (
          <li key={row.name} className={styles.row}>
            <span className={styles.ball} style={{background: row.colour}} aria-hidden="true" />
            <span className={styles.name}>{row.name}</span>
            {row.level !== undefined ? (
              <>
                <span className={styles.level}>Lv {row.level}</span>
                <span className={styles.seen}>last seen {row.seen}</span>
              </>
            ) : (
              <span className={styles.private}>level hidden by player</span>
            )}
          </li>
        ))}
      </ul>
      <figcaption className={styles.caption}>Up to 250 players, one request.</figcaption>
    </figure>
  );
}
