// Fetches UCL league-phase matches from football-data.org and computes
// "strength of schedule" based on opponents' live results.
import { writeFileSync } from "node:fs";

const KEY = process.env.FOOTBALL_DATA_KEY || "proxy-injected";
const SEASON = process.env.SEASON || "2026";
const url = `https://api.football-data.org/v4/competitions/CL/matches?season=${SEASON}&stage=LEAGUE_STAGE`;

const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
const { matches } = await res.json();

const teams = new Map();
const team = (t) => {
  if (!teams.has(t.id))
    teams.set(t.id, { id: t.id, name: t.shortName || t.name, tla: t.tla, crest: t.crest,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, fixtures: [] });
  return teams.get(t.id);
};

for (const m of matches) {
  const h = team(m.homeTeam), a = team(m.awayTeam);
  const done = m.status === "FINISHED";
  const hs = m.score.fullTime.home, as = m.score.fullTime.away;
  h.fixtures.push({ opp: a.id, home: true, md: m.matchday, date: m.utcDate, done, gf: hs, ga: as });
  a.fixtures.push({ opp: h.id, home: false, md: m.matchday, date: m.utcDate, done, gf: as, ga: hs });
  if (!done) continue;
  for (const [t, f, g] of [[h, hs, as], [a, as, hs]]) {
    t.p++; t.gf += f; t.ga += g;
    if (f > g) { t.w++; t.pts += 3; } else if (f === g) { t.d++; t.pts++; } else t.l++;
  }
}

const pts = (f, g) => (f > g ? 3 : f === g ? 1 : 0);
for (const t of teams.values()) {
  let s = { oppPts: 0, oppAdj: 0, oppGF: 0, oppGA: 0, oppP: 0 };
  for (const f of t.fixtures) {
    const o = teams.get(f.opp);
    s.oppPts += o.pts; s.oppGF += o.gf; s.oppGA += o.ga; s.oppP += o.p;
    // Points the opponent took off this team don't count toward its "strength"
    s.oppAdj += o.pts - (f.done ? pts(f.ga, f.gf) : 0);
  }
  Object.assign(t, s, {
    oppGD: s.oppGF - s.oppGA,
    oppPPG: s.oppP ? +(s.oppPts / s.oppP).toFixed(3) : 0,
  });
  t.fixtures.sort((x, y) => x.md - y.md);
}

const list = [...teams.values()].sort((a, b) => b.oppAdj - a.oppAdj || b.oppPts - a.oppPts);
const table = [...teams.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
table.forEach((t, i) => (t.rank = i + 1));

const played = matches.filter((m) => m.status === "FINISHED");
writeFileSync("data/data.json", JSON.stringify({
  season: SEASON, updated: new Date().toISOString(),
  matchday: Math.max(0, ...played.map((m) => m.matchday)),
  played: played.length, total: matches.length, teams: list,
}));
console.log(`OK: ${list.length} teams, ${played.length}/${matches.length} matches`);
