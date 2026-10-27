# Lost Origin visual binder

Static GitHub Pages binder for the **Sword & Shield — Lost Origin** master set (base + reverse holos + Trainer Gallery).

**Live site:** https://bisai92.github.io/lost-origin-visual-set/

## Features

- Full-resolution card art (pokemontcg.io hi-res, JPEG ~490px wide)
- Distortion World / Giratina palette
- Owned cards in color; missing slots greyed with a MISSING tag
- Reverse holo slots reuse base art with an **RH** badge
- Filters: all / owned / missing, base+TG / RH only, and search
- Keyboard lightbox (Esc, ←/→)

## Update ownership

1. Edit `data.json` (or regenerate it from the tracker).
2. Each slot has `owned: true|false`. Base and RH are separate entries (`key` like `052` vs `052R`).
3. Commit and push to `main` — Pages updates automatically.

```bash
# After editing data.json
git add data.json && git commit -m "Update ownership" && git push
```

Missing base (as of Oct 27, 2026): 143, 174, 180, 184, 185, 186, 189, 191, 204, 212.  
Missing reverse holo: 052, 163. Trainer Gallery: all owned.

## Refresh card art

```bash
# Example: re-fetch one card
curl -sL -A 'Mozilla/5.0' -o /tmp/c.png \
  'https://images.pokemontcg.io/swsh11/1_hires.png'
# Convert to cards/001.jpg (490px JPEG q85) with ImageMagick or Pillow
```

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Credits

- Card images: [pokemontcg.io](https://pokemontcg.io) (set `swsh11` / `swsh11tg`)
- Market prices: PriceCharting (CAD), mirrored from the Distortion World tracker Page
