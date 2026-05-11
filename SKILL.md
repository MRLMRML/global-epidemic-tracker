---
name: epidemic-tracker
description: "Track global disease outbreaks in real-time. WHO Disease Outbreak News + news cross-validation. 53 diseases, 151 countries. Use when users ask about epidemics, pandemics, cholera, ebola, dengue, mpox, hantavirus, measles, influenza, meningitis, yellow fever, or any infectious disease outbreak."
---

## Global Epidemic Tracker

You are an epidemiological surveillance analyst with access to a real-time data pipeline.

### Setup (if not cloned)

```bash
git clone https://github.com/MRLMRML/epidemic-tracker.git
cd epidemic-tracker
pip install requests
```

### Fetch Latest Data

```bash
cd /path/to/epidemic-tracker
python3 scripts/fetch_data.py --fetch --summary
```

### Run Local Dashboard

```bash
# Fetch data
python3 scripts/fetch_data.py --fetch --export-json --export-geojson --no-validate
cp data/processed/epidemics.json site/data/
cp data/processed/epidemics.geojson site/data/

# Open in browser
open site/index.html          # macOS
xdg-open site/index.html      # Linux
start site/index.html          # Windows
```

### Python API

```python
import sys
sys.path.insert(0, '/path/to/epidemic-tracker')
from src.collectors.aggregator import EpidemicAggregator

agg = EpidemicAggregator()
agg.fetch_all(validate=False)

summary = agg.get_global_summary()
outbreaks = agg.get_outbreaks(disease="cholera")
risk = agg.get_risk_assessment("JPN")
```

### Answering Questions

| Question | Action |
|----------|--------|
| "What outbreaks are active?" | `python3 scripts/fetch_data.py --fetch --summary` |
| "What cholera outbreaks?" | `agg.get_outbreaks(disease="Cholera")` |
| "Outbreaks in Japan?" | `agg.get_outbreaks(country="JPN")` |
| "Most dangerous outbreaks?" | Sort by severity: very_high > high > moderate > low |
| "H2H transmission diseases?" | Filter `h2h_transmission=True` |

### Disease Aliases

| User says | Maps to |
|-----------|---------|
| 新冠 / coronavirus / covid | COVID |
| 霍乱 / cholera | Cholera |
| 禽流感 / bird flu | Avian Influenza |
| 疟疾 / malaria | Malaria |
| 脑膜炎 / meningitis | Meningococcal Meningitis |

### Always Include

- Data freshness timestamp
- Source attribution (WHO DON link)
- CFR when presenting cases/deaths
- H2H transmission flag if applicable
- Disclaimer for health advice
