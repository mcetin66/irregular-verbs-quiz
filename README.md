# Avrupa Kupaları Rakip Gücü

Şampiyonlar Ligi, Avrupa Ligi ve Konferans Ligi 2026/27 lig aşamasında her takımın rakiplerinin
gücüne göre fikstür zorluğu: rakip puanı, gol, Elo, başarı haritası ve ısı haritası.

- `scripts/fetch-espn.mjs`: ESPN'den maçları çeker, `data/ucl.json`, `data/uel.json`, `data/uecl.json` üretir (anahtar gerekmez)
- `scripts/elo.mjs`: clubelo.com'dan Elo puanlarını çeker (`data/elo.json`)

```
node scripts/elo.mjs && node scripts/fetch-espn.mjs
python3 -m http.server   # index.html'i aç
```
