// Fetches UCL / UEL / UECL league-phase matches from ESPN's public API and computes
// opponent-strength stats per team. Writes data/<comp>.json.
import { readFileSync, writeFileSync } from "node:fs";

const COMPS = { ucl: "uefa.champions", uel: "uefa.europa", uecl: "uefa.europa.conf" };
const SEASON = 2026;

async function events(league) {
  const out = [];
  for (const y of [SEASON, SEASON + 1]) {
    const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${y}&limit=1000`);
    if (!r.ok) throw new Error(`${league} ${y}: ${r.status}`);
    out.push(...((await r.json()).events || []));
  }
  return out.filter((e) => e.season?.slug === "league-phase" && e.date >= `${SEASON}-07-01`);
}

let elo = {};
try { elo = JSON.parse(readFileSync("data/elo.json", "utf8")); } catch {}

for (const [comp, league] of Object.entries(COMPS)) {
  const evs = (await events(league)).sort((a, b) => a.date.localeCompare(b.date));
  const teams = new Map();
  const team = (c) => {
    const id = c.team.id;
    if (!teams.has(id)) teams.set(id, { id, name: c.team.shortDisplayName || c.team.displayName, full: c.team.displayName,
      tla: c.team.abbreviation, crest: c.team.logo, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, fixtures: [] });
    return teams.get(id);
  };
  let played = 0;
  for (const e of evs) {
    const c = e.competitions[0], st = c.status?.type || e.status.type;
    const H = c.competitors.find((x) => x.homeAway === "home"), A = c.competitors.find((x) => x.homeAway === "away");
    const h = team(H), a = team(A), done = st.completed === true;
    const hs = done ? +H.score : null, as = done ? +A.score : null;
    h.fixtures.push({ opp: a.id, home: true, md: h.fixtures.length + 1, date: e.date, done, gf: hs, ga: as });
    a.fixtures.push({ opp: h.id, home: false, md: a.fixtures.length + 1, date: e.date, done, gf: as, ga: hs });
    if (!done) continue;
    played++;
    for (const [t, f, g] of [[h, hs, as], [a, as, hs]]) {
      t.p++; t.gf += f; t.ga += g;
      if (f > g) { t.w++; t.pts += 3; } else if (f === g) { t.d++; t.pts++; } else t.l++;
    }
  }
  for (const t of teams.values()) {
    const opp = t.fixtures.map((f) => teams.get(f.opp));
    t.oppPts = opp.reduce((s, o) => s + o.pts, 0);
    t.oppGF = opp.reduce((s, o) => s + o.gf, 0);
    t.oppGA = opp.reduce((s, o) => s + o.ga, 0);
    const oppP = opp.reduce((s, o) => s + o.p, 0);
    t.oppGD = t.oppGF - t.oppGA;
    t.oppPPG = oppP ? +(t.oppPts / oppP).toFixed(3) : 0;
    t.elo = elo[comp]?.[t.id]?.elo ?? null;
  }
  for (const t of teams.values()) {
    const e = t.fixtures.map((f) => teams.get(f.opp).elo).filter(Boolean);
    t.oppElo = e.length >= t.fixtures.length - 1 ? Math.round(e.reduce((a, b) => a + b, 0) / e.length) : null;
  }
  const list = [...teams.values()].sort((a, b) => b.oppPts - a.oppPts || b.oppGD - a.oppGD);
  [...teams.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf).forEach((t, i) => (t.rank = i + 1));
  const games = list[0]?.fixtures.length || 0;
  const matchday = Math.min(...list.map((t) => t.p));
  writeFileSync(`data/${comp}.json`, JSON.stringify({ comp, season: String(SEASON), updated: new Date().toISOString(),
    games, matchday, played, total: evs.length, teams: list }));
  console.log(`${comp}: ${list.length} teams, ${games} games each, ${played}/${evs.length} played`);
}
