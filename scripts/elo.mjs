// Fetches each team's current Elo from clubelo.com into data/elo.json.
import { readFileSync, writeFileSync } from "node:fs";

const SLUG = {
  "PAE AEK": "AEK", "Feyenoord": "Feyenoord", "Barça": "Barcelona", "RC Lens": "Lens", "Aston Villa": "AstonVilla",
  "PSG": "ParisSG", "Galatasaray": "Galatasaray", "LASK": "lask", "Sl. Bratislava": "SlovanBratislava", "Roma": "Roma",
  "Inter": "Inter", "Dortmund": "Dortmund", "Como 1907": "Como", "Lille": "Lille", "PSV": "PSV", "Villarreal": "Villarreal",
  "RB Leipzig": "RBLeipzig", "Man United": "ManUnited", "Man City": "ManCity", "Atleti": "atletico", "Arsenal": "Arsenal",
  "Sporting CP": "Sporting", "Napoli": "Napoli", "Sabah FK": "sabah-fk", "Club Brugge": "Brugge", "Shaktar": "Shakhtar",
  "Real Betis": "Betis", "Slavia Praha": "SlaviaPraha", "Liverpool": "Liverpool", "Bayern": "Bayern", "Porto": "porto",
  "Bodø/Glimt": "BodoeGlimt", "Fenerbahçe": "Fenerbahce", "Real Madrid": "realmadrid", "Stuttgart": "Stuttgart", "Viking": "Viking",
};
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

const data = JSON.parse(readFileSync("data/data.json", "utf8"));
const out = {};
for (const t of data.teams) {
  const slug = SLUG[t.name];
  if (!slug) { console.warn("no slug:", t.name); continue; }
  const res = await fetch(`https://clubelo.com/${slug}`);
  if (!res.ok) { console.warn(slug, res.status); continue; }
  const txt = strip(await res.text());
  const now = +(txt.match(/Elo: (\d+)/) || [])[1];
  out[t.id] = { slug, elo: now };
  console.log(t.name, now);
  await new Promise((r) => setTimeout(r, 400));
}
writeFileSync("data/elo.json", JSON.stringify(out));
