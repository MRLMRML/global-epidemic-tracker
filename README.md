# 🌍 Global Epidemic Tracker

> **CDC is dead, we protect the people.**
>
> **El pueblo unido jamás será vencido.**

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-00d4aa?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mrlmrml.github.io/epidemic-tracker/)
[![Auto Update](https://github.com/MRLMRML/epidemic-tracker/actions/workflows/update-data.yml/badge.svg)](https://github.com/MRLMRML/epidemic-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Real-time global disease outbreak monitoring. Data from WHO Disease Outbreak News, cross-validated with independent news, presented in a multilingual interactive dashboard.

---

## 📊 Current Data

| Metric | Value |
|--------|-------|
| Active Outbreaks | 581 |
| Diseases Tracked | 53 |
| Countries Affected | 151 |
| Total Cases | 2,970,802 |
| Total Deaths | 13,677 |
| Auto-Update | Every 6 hours |

---

## 🚀 Quick Start (Local Dashboard)

### Step 1: Clone & Install

```bash
git clone https://github.com/MRLMRML/epidemic-tracker.git
cd epidemic-tracker
pip install requests
```

### Step 2: Fetch Latest Data

```bash
python3 scripts/fetch_data.py --fetch --no-validate --summary
```

This fetches data from WHO DON API, WHO GHO, and OWID. Output:

```
=================================================================
  GLOBAL EPIDEMIC TRACKER - SUMMARY
=================================================================
  Active Outbreaks:    581
  Total Cases:         2,970,802
  Total Deaths:        13,677
  Global CFR:          0.5%
  Countries Affected:  151
  Diseases Tracked:    53
```

### Step 3: Export for Dashboard

```bash
python3 scripts/fetch_data.py --fetch --export-json --export-geojson --no-validate
cp data/processed/epidemics.json site/data/
cp data/processed/epidemics.geojson site/data/
```

### Step 4: Open Dashboard

```bash
# macOS
open site/index.html

# Linux
xdg-open site/index.html

# Windows
start site/index.html

# Or just double-click site/index.html in your file manager
```

No server needed — it's a single HTML file that loads data from `site/data/epidemics.json`.

---

## 🤖 Agent Integration

Load `SKILL.md` as a skill in any AI agent tool. Compatible with:

| Tool | How to Load |
|------|------------|
| **OpenCode** | `load_skills=["epidemic-tracker"]` |
| **Claude Code** | Reference `SKILL.md` in your system prompt |
| **OpenClaw** | Include as project skill |
| **Hermes** | Add to agent context |

### Example Queries

```
"What cholera outbreaks are active?"
→ Agent fetches data, filters by disease, presents results

"What's the most dangerous outbreak in Asia?"
→ Agent queries by severity + region, sorts by CFR

"Run the dashboard locally"
→ Agent runs fetch + export, opens site/index.html

"Show me diseases with H2H transmission"
→ Agent filters h2h_transmission=true, presents list
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DATA PIPELINE                         │
│                                                         │
│  WHO DON API ──→ who_don.py    ──┐                      │
│  WHO GHO API ──→ who_gho.py    ──┼──→ aggregator.py    │
│  OWID CSV    ──→ owid.py       ──┘       ↓              │
│                                    news_validator.py    │
│                                    (Bing/Google/Reddit) │
│                                         ↓              │
│                              epidemics.json             │
│                              epidemics.geojson          │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌─────────────┐ ┌────────────┐ ┌──────────────┐
   │  Dashboard  │ │  AI Agent  │ │   CLI Tool   │
   │ site/index  │ │  SKILL.md  │ │ fetch_data.py│
   │  (HTML/JS)  │ │            │ │              │
   └─────────────┘ └────────────┘ └──────────────┘
```

### Project Structure

```
epidemic-tracker/
├── SKILL.md                          # AI agent skill
├── README.md                         # This file
├── LICENSE                           # MIT
├── requirements.txt                  # Python deps (requests)
├── scripts/
│   └── fetch_data.py                 # CLI: fetch + export + summary
├── src/
│   ├── collectors/
│   │   ├── who_don.py                # WHO Disease Outbreak News API
│   │   ├── who_gho.py                # WHO Global Health Observatory
│   │   ├── owid.py                   # Our World in Data (Mpox)
│   │   └── aggregator.py             # Multi-source merge + risk analysis
│   ├── validation/
│   │   └── news_validator.py         # Bing/Google/Reddit cross-validation
│   └── models/
│       └── __init__.py               # Data models
├── site/
│   ├── index.html                    # Dashboard (single HTML, no server)
│   └── data/                         # Live data (JSON + GeoJSON)
├── data/
│   └── processed/                    # Exported data
└── .github/workflows/
    └── update-data.yml               # Auto-update every 6 hours
```

---

## 📡 Data Sources

| Source | What | Method | Update |
|--------|------|--------|--------|
| **WHO DON API** | Global outbreak alerts | REST API | Event-driven |
| **WHO GHO** | Annual disease stats (measles, diphtheria, etc.) | REST API | Annual |
| **OWID** | Mpox daily cases by country | CSV | Daily |
| **Bing News** | Cross-validation | RSS | Per pipeline run |
| **Google News** | Cross-validation | RSS | Per pipeline run |
| **Reddit** | Community reports | API | Per pipeline run |

### Cross-Validation

Every WHO DON outbreak is verified against independent news:
- 2+ sources confirm → ✓ Verified
- 1 source → Partial verification
- 0 sources → Unverified (still shown, but flagged)

---

## 🌐 Dashboard Features

| Feature | Description |
|---------|------------|
| **Interactive map** | Dark theme, Leaflet + MarkerCluster, severity colors |
| **9 languages** | 中文 · English · Español · Русский · العربية · فارسی · Deutsch · Français · Português |
| **3 filters** | Country + Disease + Severity (multi-select with confirm/cancel) |
| **Disease tooltips** | Hover for disease description in current language |
| **Risk alerts** | H2H transmission warnings, severity ranking |
| **News ticker** | Scrolling latest outbreak news with WHO links |
| **Disease detail** | Click for 7-day / 30-day / 6-month trend charts |
| **Severity colors** | 🔴 very_high · 🟠 high · 🔵 moderate · 🟢 low |

---

## 🦠 Diseases Tracked (53)

Cholera · Ebola · Marburg · Mpox · Dengue · Measles · Influenza · Hantavirus · Yellow Fever · Meningitis · Polio · MERS · Nipah · Rift Valley Fever · West Nile · Oropouche · Lassa Fever · CCHF · Plague · Anthrax · Chikungunya · Diphtheria · Hepatitis E · Rabies · Zika · COVID-19 · SARS · Malaria · Avian Influenza · and more.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Areas to contribute:**
- New data source collectors
- Disease name translations (add to `DN` map in `site/index.html`)
- Dashboard UI improvements
- Data accuracy fixes

---

## 📜 License

MIT — Use it, fork it, deploy it. The people's data belongs to the people.
