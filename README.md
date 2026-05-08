# 🌍 Global Epidemic Tracker

> **"El pueblo unido jamás será vencido"**

[![Dashboard](https://img.shields.io/badge/Live-Dashboard-brightgreen?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mrlmrml.github.io/epidemic-tracker/)
[![Actions](https://github.com/MRLMRML/epidemic-tracker/actions/workflows/update-data.yml/badge.svg)](https://github.com/MRLMRML/epidemic-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Real-time monitoring of global disease outbreaks. Data sourced from WHO Disease Outbreak News, cross-validated against independent news outlets. Auto-updates every 6 hours.

## Dashboard

**[→ Open Dashboard](https://mrlmrml.github.io/epidemic-tracker/)**

The dashboard supports **8 languages** (中文, English, Español, Русский, العربية, فارسی, Deutsch, Français, Português) and features:

- Interactive world map with cluster markers
- Severity-ranked outbreak list (Critical → Low)
- Disease breakdown with case/death/CFR statistics
- Risk analysis panel with H2H transmission alerts
- Scrolling news ticker
- News cross-validation indicators

## Data Pipeline

```bash
# Install
pip install requests

# Fetch from WHO DON API, cross-validate with news, export
python3 scripts/fetch_data.py --fetch --validate --summary

# Export JSON + GeoJSON for dashboard
python3 scripts/fetch_data.py --fetch --validate --export-json --export-geojson
```

### How It Works

```
WHO Disease Outbreak News API
        ↓
   Data Collector (all diseases)
        ↓
   News Cross-Validation
   (Bing News · Google News · Reddit)
        ↓
   Aggregator + Risk Analysis
        ↓
   JSON / GeoJSON Export
        ↓
   GitHub Pages Dashboard
   (auto-updated via GitHub Actions)
```

## Agent Integration

This project includes a `SKILL.md` file for AI agent frameworks. Load it as a skill to enable natural language epidemic queries.

**Trigger keywords**: epidemic, outbreak, disease, cholera, ebola, dengue, mpox, hantavirus, measles, influenza, meningitis, yellow fever, MERS, nipah, lassa, marburg

## Data Sources

| Source | What | Update |
|--------|------|--------|
| WHO DON API | Global outbreak alerts | Event-driven |
| Bing News | Cross-validation | Per-run |
| Google News RSS | Cross-validation | Per-run |
| Reddit | Community reports | Per-run |

## Diseases Tracked

Cholera, Ebola, Marburg, Mpox, Dengue, Measles, Influenza, Hantavirus, Yellow Fever, Meningitis, Polio, MERS, Nipah, Rift Valley Fever, West Nile Virus, Lassa Fever, Crimean-Congo HF, Plague, Anthrax, Chikungunya, Rabies, Zika, COVID-19, and more.

## Project Structure

```
├── SKILL.md                          # Agent skill
├── scripts/fetch_data.py             # CLI pipeline
├── src/
│   ├── collectors/who_don.py         # WHO DON collector
│   ├── validation/news_validator.py  # News cross-validation
│   └── collectors/aggregator.py      # Aggregation + analysis
├── site/
│   ├── index.html                    # Dashboard
│   └── data/                         # Real-time data
└── .github/workflows/update-data.yml # Auto-update cron
```

## License

MIT
