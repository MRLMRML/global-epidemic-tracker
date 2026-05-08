# 🌍 Global Epidemic Tracker

> **"El pueblo unido jamás será vencido"** — 团结的人民永远不会被击败

[![Dashboard](https://img.shields.io/badge/Dashboard-Live-brightgreen)](https://mrlmrml.github.io/epidemic-tracker/)
[![Data Update](https://github.com/MRLMRML/epidemic-tracker/actions/workflows/update-data.yml/badge.svg)](https://github.com/MRLMRML/epidemic-tracker/actions/workflows/update-data.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Real-time global disease outbreak monitoring with news cross-validation.

## 🖥️ Live Dashboard

**[https://mrlmrml.github.io/epidemic-tracker/](https://mrlmrml.github.io/epidemic-tracker/)**

- 🗺️ Dark war-room style interactive map with marker clustering
- ⚠️ Severity-based outbreak prioritization
- ✓ News cross-validation (Bing · Google · Reddit)
- 🔄 Auto-updates every 6 hours via GitHub Actions
- 🇨🇳 中文/English bilingual

## 🔧 Quick Start

```bash
pip install requests
python3 scripts/fetch_data.py --fetch --validate --summary
```

## 🤖 Agent Skill

Load `SKILL.md` in any AI agent. Triggers on: epidemic, outbreak, cholera, ebola, dengue, mpox, hantavirus, measles, influenza...

## 📡 Data Sources

| Source | Type |
|--------|------|
| WHO DON API | Real-time outbreak alerts |
| Bing News | Cross-validation |
| Google News RSS | Cross-validation |
| Reddit | Community reports |

## 📜 License

MIT
