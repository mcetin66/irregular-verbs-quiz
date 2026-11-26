# UCL Rakip Gücü

Şampiyonlar Ligi 2026/27 lig aşamasında her takımın 8 rakibinin canlı performansına göre fikstür zorluğu tablosu.

- **Ham puan:** 8 rakibin topladığı toplam puan
- Rakiplerin attığı/yediği goller, averaj, maç başı puan

## Çalıştırma
```
FOOTBALL_DATA_KEY=xxx node scripts/fetch.mjs   # data/data.json üretir
python3 -m http.server                          # index.html'i aç
```
Veri GitHub Actions ile 3 saatte bir otomatik güncellenir (`FOOTBALL_DATA_KEY` repo secret'ı gerekli).
