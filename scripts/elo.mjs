// Fetches each team's current Elo from clubelo.com for every competition file.
// Team -> ClubElo page slug: manual overrides first, then automatic name matching.
import { readFileSync, writeFileSync } from "node:fs";

const OVERRIDE = {
  "Paris Saint-Germain": "ParisSG", "Manchester United": "ManUnited", "Slavia Prague": "SlaviaPraha", "Bodo/Glimt": "BodoeGlimt",
  "Hapoel Be'er": "Beer-Sheva", "Hapoel Beer Sheva": "Beer-Sheva", "Celta Vigo": "rc-celta", "Sparta Prague": "SpartaPraha",
  "Olympiacos": "Olympiakos", "Union St.-Gilloise": "StGillis", "Sint-Truidense": "StTruiden", "AGF": "Aarhus",
  "Iberia 1999": "fc-iberia-1999", "Red Star Belgrade": "CrvenaZvezda", "Lincoln Red Imps": "Lincoln", "FC Nordsjælland": "Nordsjaelland", "Egnatia": "EgnatiaRrogozhine",
  "Riga FC": "FKRiga", "Mjällby AIF": "Mjaellby", "Inter D'Escaldes": "Escaldes", "Internazionale": "Inter",
};
const DROP = new Set(["fc", "fk", "sk", "sc", "ac", "as", "cf", "bk", "if", "afc", "rc", "ssc", "club", "calcio", "1907"]);
const norm = (s) => s.replace(/ø/g, "o").replace(/Ø/g, "O").normalize("NFKD").replace(/[^A-Za-z]/g, "").toLowerCase();
const slugs = readFileSync("data/clubelo-slugs.txt", "utf8").split(/\s+/).filter(Boolean);
const bySlug = new Map(slugs.map((s) => [norm(s), s]));
function* candidates(name) {
  yield norm(name);
  const w = name.split(/[\s\-.]+/).filter((x) => x && !DROP.has(norm(x)));
  yield norm(w.join(""));
  for (const x of [...w].sort((a, b) => b.length - a.length)) yield norm(x);
}
const slugFor = (t) => OVERRIDE[t.full] || OVERRIDE[t.name] ||
  [t.full, t.name].flatMap((n) => [...candidates(n)]).map((k) => bySlug.get(k)).find(Boolean);
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

let out = {};
try { out = JSON.parse(readFileSync("data/elo.json", "utf8")); } catch {}
for (const comp of ["ucl", "uel", "uecl"]) {
  const data = JSON.parse(readFileSync(`data/${comp}.json`, "utf8"));
  const cur = (out[comp] = out[comp] || {});
  for (const t of data.teams) {
    const slug = slugFor(t);
    if (!slug) { console.warn(`${comp}: no ClubElo match for ${t.full}`); continue; }
    try {
      const r = await fetch(`https://clubelo.com/${slug}`);
      const m = r.ok && strip(await r.text()).match(/ClubElo .*?Elo Ratings (.+?) (?:[A-Z][A-Za-z ]*?, )?Europe, Elo: (\d+)/);
      if (!m) { console.warn(`${comp}: ${t.full} -> ${slug}: ${r.status}, no Elo`); continue; }
      cur[t.id] = { slug, club: m[1], elo: +m[2] };
    } catch (e) { console.warn(`${comp}: ${t.full}: ${e.message}`); }
    await new Promise((r) => setTimeout(r, 250));
  }
}
writeFileSync("data/elo.json", JSON.stringify(out));
for (const c in out) console.log(c, Object.keys(out[c]).length, "teams with Elo");
