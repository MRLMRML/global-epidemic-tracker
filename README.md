# 🌍 Global Epidemic Tracker

Real-time disease outbreak monitoring with news cross-validation. Inspired by JHU CSSE COVID-19 Dashboard.

## What It Does

1. **Fetches** all active outbreaks from WHO Disease Outbreak News API
2. **Cross-validates** each outbreak against Bing News, Google News RSS, and Reddit
3. **Classifies** by severity, H2H transmission, travel association
4. **Exports** JSON + GeoJSON for dashboard consumption
5. **Deploys** interactive dashboard to GitHub Pages
6. **Auto-updates** every 6 hours via GitHub Actions

## Dashboard

**Live**: https://mrlmrml.github.io/epidemic-tracker/

Features:
- Dark-themed interactive world map with severity-colored markers
- Disease breakdown table with case/death/CFR stats
- Filterable outbreak list (by disease, severity, verification status)
- News cross-validation status for each outbreak
- Auto-refresh every 10 minutes

## Quick Start

```bash
pip install requests

# Full pipeline
python3 scripts/fetch_data.py --fetch --validate --summary --export-json --export-geojson

# Dashboard
# Open site/index.html (loads data from data/processed/)
```

## Agent Skill

Load `SKILL.md` as a skill in any AI agent framework. Triggers on keywords: epidemic, outbreak, disease, cholera, ebola, dengue, mpox, hantavirus, measles, influenza, etc.

## Architecture

```
WHO DON API → Collector → News Validator → Aggregator → JSON/GeoJSON
                                      ↓
                              Bing News RSS
                              Google News RSS
                              Reddit API
                                      ↓
                              Verification Status
```

## GitHub Actions

- Runs every 6 hours (cron: `0 */6 * * *`)
- Fetches latest WHO DON data
- Cross-validates with news sources
- Commits updated data to repo
- Deploys dashboard to GitHub Pages

## Data Sources

| Source | What | Real-time? |
|--------|------|-----------|
| WHO DON API | All global outbreak alerts | ✅ Event-driven |
| Bing News | News cross-validation | Per-run |
| Google News RSS | News cross-validation | Per-run |
| Reddit | Community reporting | Per-run |

## License

MIT
