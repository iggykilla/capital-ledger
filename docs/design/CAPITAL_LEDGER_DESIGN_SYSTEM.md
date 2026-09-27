# Capital Ledger design system

Canonical design direction: a calm financial workstation and investment journal. The bundled Stitch concepts informed these rules; production behavior is governed by `IMPLEMENTATION_STATUS.md`, never by a mockup.

## Typography

- Interface prose, navigation, headings and explanatory labels: Hanken Grotesk when locally available; fall back to Segoe UI / system UI. Do not depend on a remote font service for a static deployment.
- Money, percentages, dates, tickers, lot quantities and tabular headings: JetBrains Mono when locally available; fall back to Cascadia Code / system monospace. Use `font-variant-numeric: tabular-nums`, especially for aligned values.
- Scale: page title 26–32px, section title 20–24px, body 14–16px, data value 13–16px, tiny uppercase label 11–12px. The main portfolio value may reach 30–40px. Keep explanations readable on mobile.

## Semantic color tokens

| Token | Proposed dark value | Use |
| --- | --- | --- |
| `--bg` | `#0b0e14` | App canvas |
| `--surface-1` | `#121721` | Navigation and structural panes |
| `--surface-2` | `#182232` | Ledger and grouped data |
| `--surface-3` | `#1e2b3e` | Hover and interactive detail |
| `--border` | `#243347` | Hairline dividers |
| `--text-primary` | `#f8fafc` | Key values and titles |
| `--text-secondary` | `#94a3b8` | Supporting labels |
| `--text-muted` | `#64748b` | Nonessential metadata, subject to contrast checks |
| `--accent` | `#38bdf8` | Navigation, focus and selection |
| `--positive` | `#34d399` | Gains only |
| `--negative` | `#ef4444` | Losses and destructive actions only |
| `--income` | `#f59e0b` | Dividends and income |
| `--warning` | `#fbbf24` | Actionable cautions |

These are design targets, not a claim that every production CSS token has already changed. Current aliases in `src/index.css` preserve existing screens. Never use gain/loss color for decorative emphasis or Pending data. Combine color with words and sign; never rely on color alone.

## Layout and components

- Spacing increments: 4, 8, 12, 16, 20, 24 and 32px. Small label/value groups use 8–12px; sections use 20–32px. Avoid arbitrary local offsets.
- Radius: 4px controls/badges, 8px data panels, at most 12px dialogs. Prefer 1px boundaries and tonal surface steps over shadows; reserve shadows for dialogs.
- On desktop, put a compact snapshot before a dense ledger. Right-align numeric table columns; preserve visible headers and horizontal scrolling when needed. On mobile, switch to compact cards with clear value, P/L, status and actions. Keep touch controls operable.
- Excluded positions remain visible with an explicit **Excluded** label and subdued, readable values. Their switch and detail actions remain fully legible. Inclusion changes only the defined demo aggregate/weight calculations; it never deletes a record.
- Show Pending where a calculation is missing. Label synthetic values Demo. Show local data status as **Stored in this browser**; do not imply encryption or a network isolation guarantee.
- Navigation favors Portfolio, Metrics, Journal, Analysis, Data as the eventual five areas. Existing Logs and Import modal remain valid until their replacement has a real flow.

## Copy and reference handling

Use plain financial language: “Import data,” “Local data,” “Excluded,” “Pending.” Avoid terminal theater (“core vault,” “airgap,” “system verified”). Reference images are mockups, not audited values or evidence of implemented features. Do not include the original Stitch HTML in production: it uses runtime Tailwind CDN, remote icon/font CSS and scripted demo interactions.
