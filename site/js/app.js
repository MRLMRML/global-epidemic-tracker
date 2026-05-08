const DATA_URL = '../data/processed/epidemics.json';
const GEOJSON_URL = '../data/processed/epidemics.geojson';

const SEVERITY_COLORS = {
    very_high: '#ff4757',
    high: '#ffa502',
    moderate: '#4f8cff',
    low: '#2ed573',
    unknown: '#888'
};

const SEVERITY_ORDER = { very_high: 0, high: 1, moderate: 2, low: 3, unknown: 4 };

let map, markers, allData;

async function init() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18
    }).addTo(map);
    markers = L.layerGroup().addTo(map);
    await loadData();
    setInterval(loadData, 600000);
}

async function loadData() {
    try {
        const [jsonResp, geoResp] = await Promise.all([fetch(DATA_URL), fetch(GEOJSON_URL)]);
        allData = await jsonResp.json();
        const geoData = await geoResp.json();
        render(allData, geoData);
    } catch (e) {
        document.getElementById('last-update').textContent = 'Failed to load data. Run the pipeline first.';
    }
}

function render(data, geoData) {
    document.getElementById('last-update').textContent =
        `Last updated: ${new Date(data.last_update).toLocaleString()} | ${data.summary.data_sources.join(', ')}`;
    renderCards(data.summary);
    renderMap(geoData);
    renderDiseases(data.diseases);
    renderOutbreaks(data.outbreaks);
    renderValidation(data.validations);
    populateFilters(data.outbreaks);
}

function renderCards(s) {
    document.getElementById('summary-cards').innerHTML = `
        <div class="card danger"><div class="value">${s.total_active_outbreaks}</div><div class="label">Active Outbreaks</div></div>
        <div class="card warning"><div class="value">${fmt(s.total_cases)}</div><div class="label">Total Cases</div></div>
        <div class="card accent"><div class="value">${fmt(s.total_deaths)}</div><div class="label">Total Deaths</div></div>
        <div class="card purple"><div class="value">${(s.global_cfr * 100).toFixed(1)}%</div><div class="label">Global CFR</div></div>
        <div class="card success"><div class="value">${s.countries_affected}</div><div class="label">Countries</div></div>
        <div class="card"><div class="value">${s.diseases_tracked.length}</div><div class="label">Diseases</div></div>
    `;
}

function renderMap(geoData) {
    markers.clearLayers();
    geoData.features.forEach(f => {
        const p = f.properties;
        const color = SEVERITY_COLORS[p.severity] || '#888';
        const radius = Math.max(5, Math.min(30, Math.sqrt(p.cases) * 1.5));
        const marker = L.circleMarker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
            radius, color, fillColor: color, fillOpacity: 0.6, weight: 1
        });
        const v = p.verified ? '<span class="badge badge-verified">✓ Verified</span>' : '';
        const h2h = p.h2h ? '<span class="badge badge-h2h">H2H</span>' : '';
        marker.bindPopup(`
            <strong>${p.disease}</strong>${h2h}${v}<br>
            📍 ${p.location}, ${p.country}<br>
            Cases: <strong>${p.cases.toLocaleString()}</strong> | Deaths: <strong>${p.deaths.toLocaleString()}</strong><br>
            CFR: ${(p.cfr * 100).toFixed(1)}% | Severity: ${p.severity}<br>
            ${p.source_url ? `<a href="${p.source_url}" target="_blank">WHO DON →</a>` : ''}
        `);
        markers.addLayer(marker);
    });
}

function renderDiseases(diseases) {
    let html = '<table class="disease-table"><thead><tr><th>Disease</th><th>Cases</th><th>Deaths</th><th>CFR</th><th>Outbreaks</th><th>Countries</th><th>H2H</th></tr></thead><tbody>';
    for (const [name, d] of Object.entries(diseases)) {
        const h2h = d.h2h_transmission ? '<span class="badge badge-h2h">Yes</span>' : 'No';
        html += `<tr><td>${name}</td><td>${fmt(d.cases)}</td><td>${fmt(d.deaths)}</td><td>${(d.cfr*100).toFixed(1)}%</td><td>${d.outbreaks}</td><td>${d.countries}</td><td>${h2h}</td></tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('disease-table').innerHTML = html;
}

function renderOutbreaks(outbreaks) {
    const diseaseFilter = document.getElementById('disease-filter').value;
    const severityFilter = document.getElementById('severity-filter').value;
    const verifiedFilter = document.getElementById('verified-filter').value;

    let filtered = outbreaks;
    if (diseaseFilter) filtered = filtered.filter(o => o.disease === diseaseFilter);
    if (severityFilter) filtered = filtered.filter(o => o.severity === severityFilter);
    if (verifiedFilter === 'verified') filtered = filtered.filter(o => o.news_verified);
    if (verifiedFilter === 'unverified') filtered = filtered.filter(o => !o.news_verified);

    filtered.sort((a, b) => (SEVERITY_ORDER[a.severity] || 9) - (SEVERITY_ORDER[b.severity] || 9) || b.cases - a.cases);

    let html = '';
    filtered.forEach(o => {
        const v = o.news_verified ? '<span class="badge badge-verified">✓ News Verified</span>' : '<span class="badge badge-unverified">? Unverified</span>';
        const h2h = o.h2h_transmission ? '<span class="badge badge-h2h">H2H</span>' : '';
        const travel = o.travel_associated ? '<span class="badge badge-travel">Travel</span>' : '';
        html += `
            <div class="outbreak-card ${o.severity}">
                <div class="outbreak-header">
                    <span class="outbreak-disease">${o.disease} ${h2h} ${travel}</span>
                    <span class="outbreak-severity severity-${o.severity}">${o.severity.replace('_', ' ')}</span>
                </div>
                <div class="outbreak-stats">
                    <span>📍 ${o.location}, ${o.country}</span>
                    <span>Cases: <span class="num">${o.cases.toLocaleString()}</span></span>
                    <span>Deaths: <span class="num">${o.deaths.toLocaleString()}</span></span>
                    <span>CFR: <span class="num">${(o.cfr*100).toFixed(1)}%</span></span>
                </div>
                <div class="outbreak-meta">${v} ${o.source_url ? `<a href="${o.source_url}" target="_blank" style="color:var(--accent)">WHO DON →</a>` : ''} ${o.news_summary || ''}</div>
            </div>`;
    });
    document.getElementById('outbreaks-list').innerHTML = html || '<p style="color:var(--muted)">No outbreaks match filters.</p>';
}

function renderValidation(v) {
    const verified = v.verified || 0;
    const total = v.total_validated || 1;
    const pct = (verified / total * 100).toFixed(0);
    document.getElementById('validation-summary').innerHTML = `
        <p><strong>${verified}</strong> of <strong>${total}</strong> outbreaks verified by independent news sources (${pct}%)</p>
        <div class="validation-bar">
            <div class="verified" style="width:${pct}%"></div>
            <div class="unverified" style="width:${100 - pct}%"></div>
        </div>
        <p style="font-size:0.8rem;color:var(--muted)">Cross-validated via Bing News, Google News RSS, and Reddit</p>
    `;
}

function populateFilters(outbreaks) {
    const diseases = [...new Set(outbreaks.map(o => o.disease))].sort();
    const sel = document.getElementById('disease-filter');
    if (sel.options.length <= 1) {
        diseases.forEach(d => { const opt = document.createElement('option'); opt.value = d; opt.textContent = d; sel.appendChild(opt); });
    }
    document.getElementById('disease-filter').onchange = () => renderOutbreaks(allData.outbreaks);
    document.getElementById('severity-filter').onchange = () => renderOutbreaks(allData.outbreaks);
    document.getElementById('verified-filter').onchange = () => renderOutbreaks(allData.outbreaks);
}

function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return String(n);
}

init();
