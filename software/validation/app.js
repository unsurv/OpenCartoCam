'use strict';

const PROJECT_REQUEST_ID = 'github/unsurv/OpenCartoCam';
const ANALYSIS = {
  minimumIntersectionAngleDeg: 5,
  maximumRayDistanceM: 500,
  clusterRadiusM: 8,
  highQualityResidualM: 2,
  mediumQualityResidualM: 5,
};

const CLASS_STYLE = {
  'surveillance camera': { key: 'conventional', short: 'CAM', color: '#22d3ee' },
  'dome surveillance camera': { key: 'dome', short: 'DOME', color: '#fbbf24' },
};

const $ = (selector) => document.querySelector(selector);
const state = {
  capture: 0,
  detection: null,
  issues: new Map(),
  suggestionClass: '',
  mapReady: false,
  uploaded: new Map(),
  suggestions: [],
  manualSuggestions: [],
  pendingNodeClass: null,
  orphans: [],
  selectedSuggestion: null,
  selectedOrphan: null,
  detectionToSuggestion: new Map(),
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));
const toNumber = (value) => typeof value === 'number' ? value : Number(value);
const classStyle = (classLabel) => CLASS_STYLE[classLabel] || {
  key: 'other', short: 'CAM', color: '#22d3ee',
};
const cross2 = (a, b) => a.x * b.y - a.y * b.x;
const distance2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const bearingDistance = (a, b) => Math.abs((a - b + 540) % 360 - 180);

function normalizeDetections(rows) {
  return rows.map((row) => ({
    ...row,
    id: String(row.id),
    gnss_latitude_deg: toNumber(row.gnss_latitude_deg),
    gnss_longitude_deg: toNumber(row.gnss_longitude_deg),
    gnss_altitude_m: toNumber(row.gnss_altitude_m),
    camera_heading_deg: toNumber(row.camera_heading_deg),
    capture_bearing_deg: toNumber(row.capture_bearing_deg),
    image_width_px: toNumber(row.image_width_px),
    image_height_px: toNumber(row.image_height_px),
    confidence: toNumber(row.confidence),
    bbox_x_min: toNumber(row.bbox_x_min),
    bbox_y_min: toNumber(row.bbox_y_min),
    bbox_x_max: toNumber(row.bbox_x_max),
    bbox_y_max: toNumber(row.bbox_y_max),
  }));
}

function buildCaptures(rows) {
  const imageNames = [...new Set(rows.map((row) => row.image_name))];
  return imageNames.map((imageName, index) => {
    const detections = rows.filter((row) => row.image_name === imageName);
    return { index, imageName, detections, first: detections[0] };
  });
}

let normalized = [];
let captures = [];

function currentCapture() {
  return captures[state.capture];
}

function currentDetection() {
  return normalized.find((row) => row.id === state.detection) || currentCapture().detections[0];
}

function localOrigin(rows) {
  return {
    lat: rows.reduce((sum, row) => sum + row.gnss_latitude_deg, 0) / rows.length,
    lon: rows.reduce((sum, row) => sum + row.gnss_longitude_deg, 0) / rows.length,
  };
}

function project(row, origin) {
  const metresPerDegreeLat = 111320;
  const metresPerDegreeLon = metresPerDegreeLat * Math.cos(origin.lat * Math.PI / 180);
  return {
    x: (row.gnss_longitude_deg - origin.lon) * metresPerDegreeLon,
    y: (row.gnss_latitude_deg - origin.lat) * metresPerDegreeLat,
  };
}

function unproject(point, origin) {
  const metresPerDegreeLat = 111320;
  const metresPerDegreeLon = metresPerDegreeLat * Math.cos(origin.lat * Math.PI / 180);
  return {
    lat: origin.lat + point.y / metresPerDegreeLat,
    lon: origin.lon + point.x / metresPerDegreeLon,
  };
}

function ray(row, origin) {
  const angle = row.capture_bearing_deg * Math.PI / 180;
  return {
    row,
    point: project(row, origin),
    direction: { x: Math.sin(angle), y: Math.cos(angle) },
  };
}

function intersectPair(a, b) {
  if (a.row.image_name === b.row.image_name) return null;
  const denominator = cross2(a.direction, b.direction);
  const minimumAngle = ANALYSIS.minimumIntersectionAngleDeg * Math.PI / 180;
  if (Math.abs(denominator) < Math.sin(minimumAngle)) return null;

  const delta = { x: b.point.x - a.point.x, y: b.point.y - a.point.y };
  const distanceA = cross2(delta, b.direction) / denominator;
  const distanceB = cross2(delta, a.direction) / denominator;
  if (distanceA <= 0 || distanceB <= 0) return null;
  if (distanceA > ANALYSIS.maximumRayDistanceM || distanceB > ANALYSIS.maximumRayDistanceM) return null;

  return {
    point: {
      x: a.point.x + distanceA * a.direction.x,
      y: a.point.y + distanceA * a.direction.y,
    },
    detectionIds: [a.row.id, b.row.id],
  };
}

function leastSquaresIntersection(rows, origin) {
  let a00 = 0, a01 = 0, a11 = 0, b0 = 0, b1 = 0;
  rows.map((row) => ray(row, origin)).forEach(({ point, direction }) => {
    const p00 = 1 - direction.x * direction.x;
    const p01 = -direction.x * direction.y;
    const p11 = 1 - direction.y * direction.y;
    a00 += p00;
    a01 += p01;
    a11 += p11;
    b0 += p00 * point.x + p01 * point.y;
    b1 += p01 * point.x + p11 * point.y;
  });
  const determinant = a00 * a11 - a01 * a01;
  if (Math.abs(determinant) < 1e-8) return null;
  return {
    x: (b0 * a11 - b1 * a01) / determinant,
    y: (a00 * b1 - a01 * b0) / determinant,
  };
}

function clusterPairs(pairs) {
  const parents = pairs.map((_, index) => index);
  const root = (index) => {
    while (parents[index] !== index) {
      parents[index] = parents[parents[index]];
      index = parents[index];
    }
    return index;
  };
  const join = (a, b) => {
    const rootA = root(a), rootB = root(b);
    if (rootA !== rootB) parents[rootB] = rootA;
  };

  for (let a = 0; a < pairs.length; a += 1) {
    for (let b = a + 1; b < pairs.length; b += 1) {
      if (distance2(pairs[a].point, pairs[b].point) <= ANALYSIS.clusterRadiusM) join(a, b);
    }
  }
  const groups = new Map();
  pairs.forEach((pair, index) => {
    const key = root(index);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(pair);
  });
  return [...groups.values()];
}

function calculateClassIntersections(classLabel, rows) {
  const origin = localOrigin(rows);
  const rays = rows.map((row) => ray(row, origin));
  const pairs = [];
  for (let a = 0; a < rays.length; a += 1) {
    for (let b = a + 1; b < rays.length; b += 1) {
      const intersection = intersectPair(rays[a], rays[b]);
      if (intersection) pairs.push(intersection);
    }
  }

  return clusterPairs(pairs).map((group) => {
    const detectionIds = new Set(group.flatMap((pair) => pair.detectionIds));
    const centre = {
      x: group.reduce((sum, pair) => sum + pair.point.x, 0) / group.length,
      y: group.reduce((sum, pair) => sum + pair.point.y, 0) / group.length,
    };

    // Include additional near-collinear rays that pairwise angle filtering may have skipped.
    rows.map((row) => ray(row, origin)).forEach((candidate) => {
      const offset = { x: centre.x - candidate.point.x, y: centre.y - candidate.point.y };
      const forward = offset.x * candidate.direction.x + offset.y * candidate.direction.y;
      const residual = Math.abs(cross2(candidate.direction, offset));
      if (forward > 0 && residual <= ANALYSIS.clusterRadiusM) detectionIds.add(candidate.row.id);
    });

    const supportingRows = rows.filter((row) => detectionIds.has(row.id));
    const captureNames = [...new Set(supportingRows.map((row) => row.image_name))];
    if (captureNames.length < 2) return null;
    const point = leastSquaresIntersection(supportingRows, origin);
    if (!point) return null;

    const residuals = supportingRows.map((row) => {
      const candidate = ray(row, origin);
      const offset = { x: point.x - candidate.point.x, y: point.y - candidate.point.y };
      return Math.abs(cross2(candidate.direction, offset));
    });
    const rms = Math.sqrt(residuals.reduce((sum, value) => sum + value * value, 0) / residuals.length);
    const support = captureNames.length;
    const quality = support >= 3 && rms <= ANALYSIS.highQualityResidualM
      ? 'High'
      : support >= 2 && rms <= ANALYSIS.mediumQualityResidualM ? 'Medium' : 'Low';

    return {
      classLabel,
      ...unproject(point, origin),
      support,
      rms,
      quality,
      detectionIds: supportingRows.map((row) => row.id),
      captureNames,
    };
  }).filter(Boolean);
}

function analyseIntersections() {
  const classes = [...new Set(normalized.map((row) => row.class_label))];
  const suggestions = classes.flatMap((classLabel) => {
    const rows = normalized.filter((row) => row.class_label === classLabel);
    return calculateClassIntersections(classLabel, rows);
  }).sort((a, b) => {
    const classDifference = classStyle(a.classLabel).key.localeCompare(classStyle(b.classLabel).key);
    return classDifference || b.support - a.support || a.rms - b.rms;
  }).map((suggestion, index) => ({
    ...suggestion,
    id: `S${String(index + 1).padStart(2, '0')}`,
  }));

  state.suggestions = [...suggestions, ...state.manualSuggestions];
  state.detectionToSuggestion = new Map();
  suggestions.forEach((suggestion) => suggestion.detectionIds.forEach((id) => {
    state.detectionToSuggestion.set(id, suggestion.id);
  }));
  const linkedIds = new Set(suggestions.flatMap((suggestion) => suggestion.detectionIds));
  state.orphans = normalized.filter((row) => !linkedIds.has(row.id));

  if (state.selectedSuggestion && !state.suggestions.some((node) => node.id === state.selectedSuggestion)) {
    state.selectedSuggestion = null;
  }
  if (state.selectedOrphan && !state.orphans.some((row) => row.id === state.selectedOrphan)) {
    state.selectedOrphan = null;
  }
  const suggestedClasses = [...new Set(state.suggestions.map((node) => node.classLabel))].sort();
  if (state.suggestionClass && !suggestedClasses.includes(state.suggestionClass)) state.suggestionClass = '';
  $('#suggestionClassFilter').innerHTML = '<option value="">All classes</option>'
    + suggestedClasses.map((classLabel) => `<option value="${escapeHtml(classLabel)}">${escapeHtml(classLabel)}</option>`).join('');
  $('#suggestionClassFilter').value = state.suggestionClass;
  const selected = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  if (selected && state.suggestionClass && selected.classLabel !== state.suggestionClass) state.selectedSuggestion = null;
  $('#objectCount').textContent = state.suggestions.length;
  renderSuggestions();
  renderOrphans();
  renderTable();
}

function validateDataset() {
  state.issues.clear();
  const ids = new Set();
  captures.forEach((capture) => {
    const issues = [];
    capture.detections.forEach((row) => {
      if (ids.has(row.id)) issues.push(`Duplicate detection ID ${row.id}`);
      ids.add(row.id);
      if (!Number.isFinite(row.gnss_latitude_deg) || row.gnss_latitude_deg < -90 || row.gnss_latitude_deg > 90) issues.push(`${row.id}: invalid latitude`);
      if (!Number.isFinite(row.gnss_longitude_deg) || row.gnss_longitude_deg < -180 || row.gnss_longitude_deg > 180) issues.push(`${row.id}: invalid longitude`);
      if (row.camera_heading_deg < 0 || row.camera_heading_deg >= 360) issues.push(`${row.id}: invalid camera heading`);
      if (row.capture_bearing_deg < 0 || row.capture_bearing_deg >= 360) issues.push(`${row.id}: invalid capture bearing`);
      if (row.confidence < 0 || row.confidence > 1) issues.push(`${row.id}: confidence outside [0,1]`);
      if (!(row.bbox_x_min >= 0 && row.bbox_x_min < row.bbox_x_max && row.bbox_x_max <= row.image_width_px)) issues.push(`${row.id}: invalid horizontal rectangle`);
      if (!(row.bbox_y_min >= 0 && row.bbox_y_min < row.bbox_y_max && row.bbox_y_max <= row.image_height_px)) issues.push(`${row.id}: invalid vertical rectangle`);
      const centreX = (row.bbox_x_min + row.bbox_x_max) / 2;
      const expected = (row.camera_heading_deg + ((centreX / row.image_width_px) - 0.5) * 360 + 360) % 360;
      if (bearingDistance(expected, row.capture_bearing_deg) > 0.1) issues.push(`${row.id}: bearing does not match rectangle centre`);
      if (row.gnss_latitude_deg !== capture.first.gnss_latitude_deg
        || row.gnss_longitude_deg !== capture.first.gnss_longitude_deg
        || row.camera_heading_deg !== capture.first.camera_heading_deg) {
        issues.push(`${row.id}: capture metadata is inconsistent`);
      }
    });
    state.issues.set(capture.index, issues);
  });
  const valid = captures.filter((capture) => state.issues.get(capture.index).length === 0).length;
  $('#validCount').textContent = captures.length ? `${valid} / ${captures.length}` : '—';
  renderTable();
}

function parseCsv(text) {
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"' && field === '') quoted = true;
    else if (character === ',') {
      record.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else field += character;
  }
  if (quoted) throw new Error('The CSV contains an unterminated quoted field.');
  if (field || record.length) {
    record.push(field);
    records.push(record);
  }
  if (!records.length) throw new Error('The CSV is empty.');

  const headers = records.shift().map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '') : header
  ).trim());
  const required = [
    'id', 'gnss_latitude_deg', 'gnss_longitude_deg', 'gnss_altitude_m',
    'camera_heading_deg', 'capture_bearing_deg', 'image_name', 'image_width_px',
    'image_height_px', 'class_label', 'confidence', 'bbox_x_min', 'bbox_y_min',
    'bbox_x_max', 'bbox_y_max',
  ];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`Missing CSV columns: ${missing.join(', ')}`);

  const rows = records.filter((record) => record.some((value) => value.trim())).map((record, index) => {
    if (record.length !== headers.length) throw new Error(`CSV row ${index + 2} has ${record.length} columns; expected ${headers.length}.`);
    return Object.fromEntries(headers.map((header, column) => [header, record[column].trim()]));
  });
  if (!rows.length) throw new Error('The CSV contains no detections.');
  return rows;
}

function imageBasename(imageName) {
  return imageName.split(/[\\/]/).pop();
}

function loadCaptureDataset(rows, imageFiles, imageBaseUrl) {
  const nextNormalized = normalizeDetections(rows);
  const nextCaptures = buildCaptures(nextNormalized);
  const filesByName = new Map(imageFiles.map((file) => [file.name, file]));

  state.uploaded.forEach((url) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  });
  state.uploaded.clear();
  nextCaptures.forEach((capture) => {
    const fileName = imageBasename(capture.imageName);
    const file = filesByName.get(fileName);
    const url = file ? URL.createObjectURL(file) : `${imageBaseUrl}${encodeURIComponent(fileName)}`;
    state.uploaded.set(capture.imageName, url);
  });

  normalized = nextNormalized;
  captures = nextCaptures;
  state.capture = 0;
  state.detection = captures[0].detections[0].id;
  state.issues.clear();
  state.suggestionClass = '';
  state.manualSuggestions = [];
  state.pendingNodeClass = null;
  state.selectedSuggestion = null;
  state.selectedOrphan = null;
  state.mapReady = false;
  $('#captureCount').textContent = captures.length;
  $('#detectionCount').textContent = normalized.length;
  validateDataset();
  analyseIntersections();
  renderCapture();
  updateAddNodeControl();
  refreshMap();
  $('#lastValidated').textContent = 'Capture CSV loaded · ready for manual review';
  return captures.filter((capture) => state.uploaded.has(capture.imageName)).length;
}

function renderOverlay() {
  $('#detectionOverlay').innerHTML = currentCapture().detections.map((row) => {
    const color = classStyle(row.class_label).color;
    const selected = row.id === state.detection;
    const labelY = Math.max(52, row.bbox_y_min - 18);
    return `
      <g class="detection-box ${selected ? 'selected' : ''}" data-detection="${escapeHtml(row.id)}" style="color:${color}" opacity="${selected ? 1 : 0.72}">
        <rect x="${row.bbox_x_min}" y="${row.bbox_y_min}" width="${row.bbox_x_max - row.bbox_x_min}" height="${row.bbox_y_max - row.bbox_y_min}"
          fill="${color}" fill-opacity="${selected ? 0.1 : 0.03}" stroke="${color}" stroke-width="${selected ? 7 : 4}"/>
        <rect x="${row.bbox_x_min}" y="${labelY - 45}" width="${Math.max(390, row.class_label.length * 24)}" height="58" fill="#0c1220" fill-opacity=".9"/>
        <text x="${row.bbox_x_min + 12}" y="${labelY - 7}" fill="${color}" font-size="32" font-family="monospace">
          ${escapeHtml(row.class_label)} · ${(row.confidence * 100).toFixed(0)}%
        </text>
      </g>`;
  }).join('');
  document.querySelectorAll('.detection-box').forEach((element) => {
    element.addEventListener('click', () => selectDetection(element.dataset.detection));
  });
}

function renderDetectionStrip() {
  $('#detectionStrip').innerHTML = currentCapture().detections.map((row) => {
    const nodeId = state.detectionToSuggestion.get(row.id);
    return `
      <button type="button" class="detection-chip ${row.id === state.detection ? 'active' : ''}" data-detection="${escapeHtml(row.id)}">
        <strong>${escapeHtml(row.class_label)}</strong>
        <span>${row.capture_bearing_deg.toFixed(2)}° · ${nodeId ? `node ${nodeId}` : 'orphaned'}</span>
      </button>`;
  }).join('');
  document.querySelectorAll('.detection-chip').forEach((element) => {
    element.addEventListener('click', () => selectDetection(element.dataset.detection));
  });
}

function updateImageStage() {
  const capture = currentCapture();
  const image = $('#uploadedImage');
  if (!capture) {
    image.onerror = null;
    image.hidden = true;
    image.removeAttribute('src');
    $('#stageTag').textContent = 'LOAD A CAPTURE CSV FOR PREVIEW';
    return;
  }

  const url = state.uploaded.get(capture.imageName);
  const dimensions = `${capture.first.image_width_px} × ${capture.first.image_height_px}`;
  $('#detectionOverlay').setAttribute('viewBox', `0 0 ${capture.first.image_width_px} ${capture.first.image_height_px}`);
  if (url) {
    image.onerror = () => {
      if (currentCapture().imageName !== capture.imageName || state.uploaded.get(capture.imageName) !== url) return;
      image.hidden = true;
      $('#stageTag').textContent = `IMAGE NOT FOUND IN ./images · ${dimensions} COORDINATES`;
    };
    image.src = url;
    image.alt = capture.imageName;
    image.hidden = false;
    $('#stageTag').textContent = `LOCAL IMAGE · ${dimensions} COORDINATES`;
  } else {
    image.hidden = true;
    image.removeAttribute('src');
    $('#stageTag').textContent = `IMAGE NOT LOADED · ${dimensions} COORDINATES`;
  }
}

function renderCapture() {
  const capture = currentCapture();
  if (!capture) {
    $('#captureLabel').textContent = 'No captures loaded';
    $('#metaImage').textContent = '—';
    $('#metaImage').removeAttribute('title');
    $('#metaGnss').textContent = '—';
    $('#metaHeading').textContent = '—';
    $('#detectionOverlay').innerHTML = '';
    $('#detectionStrip').innerHTML = '';
    updateImageStage();
    renderTable();
    return;
  }

  const row = capture.first;
  $('#captureLabel').textContent = `Capture ${String(state.capture + 1).padStart(2, '0')} / ${captures.length}`;
  $('#metaImage').textContent = capture.imageName;
  $('#metaImage').title = capture.imageName;
  $('#metaGnss').textContent = `${row.gnss_latitude_deg.toFixed(7)}, ${row.gnss_longitude_deg.toFixed(7)}`;
  $('#metaHeading').textContent = `${row.camera_heading_deg.toFixed(1)}° · ${row.gnss_altitude_m.toFixed(2)} m`;
  updateImageStage();
  renderOverlay();
  renderDetectionStrip();
  renderTable();
  updateMapSelection();
}

function filteredSuggestions() {
  return state.suggestionClass
    ? state.suggestions.filter((node) => node.classLabel === state.suggestionClass)
    : state.suggestions;
}

function renderSuggestions() {
  const rows = filteredSuggestions();
  $('#suggestionCount').textContent = state.suggestionClass
    ? `${rows.length} / ${state.suggestions.length} nodes`
    : `${rows.length} node${rows.length === 1 ? '' : 's'}`;
  $('#emptySuggestions').hidden = rows.length > 0;
  $('#emptySuggestions').textContent = state.suggestions.length
    ? 'No suggested nodes match this class.'
    : 'No multi-capture intersections found.';
  $('#suggestionTableBody').innerHTML = rows.map((node) => `
    <tr data-suggestion="${node.id}" tabindex="0" class="${node.id === state.selectedSuggestion ? 'selected' : ''}" aria-selected="${node.id === state.selectedSuggestion}">
      <td class="node-cell">${node.id}</td>
      <td>${escapeHtml(classStyle(node.classLabel).short)}</td>
      <td>${node.lat.toFixed(7)}</td>
      <td>${node.lon.toFixed(7)}</td>
      <td>${node.support} captures</td>
      <td>${node.rms.toFixed(2)} m</td>
      <td class="quality-${node.quality.toLowerCase()}">${node.quality}</td>
    </tr>`).join('');
  document.querySelectorAll('#suggestionTableBody tr').forEach((element) => {
    const activate = () => selectSuggestion(element.dataset.suggestion);
    element.addEventListener('click', activate);
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });
}

function renderOrphans() {
  $('#orphanCount').textContent = state.orphans.length;
  $('#emptyOrphans').hidden = state.orphans.length > 0;
  $('#orphanList').innerHTML = state.orphans.map((row) => `
    <button type="button" class="orphan-item ${row.id === state.selectedOrphan ? 'selected' : ''}" data-orphan="${escapeHtml(row.id)}">
      ${escapeHtml(row.image_name)} · ${escapeHtml(row.class_label)} · ${row.capture_bearing_deg.toFixed(2)}°
    </button>`).join('');
  document.querySelectorAll('.orphan-item').forEach((element) => {
    element.addEventListener('click', () => selectOrphan(element.dataset.orphan));
  });
}

function filteredCaptures() {
  let rows = captures;
  const suggestion = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  if (suggestion) rows = rows.filter((capture) => suggestion.captureNames.includes(capture.imageName));
  if (state.selectedOrphan) {
    const orphan = normalized.find((row) => row.id === state.selectedOrphan);
    if (orphan) rows = rows.filter((capture) => capture.imageName === orphan.image_name);
  }
  return rows;
}

function renderTable() {
  const rows = filteredCaptures();
  const suggestion = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  $('#tableCount').textContent = `${rows.length} record${rows.length === 1 ? '' : 's'}`;
  $('#emptyState').hidden = rows.length > 0;
  $('#clearSuggestionFilter').hidden = !suggestion && !state.selectedOrphan;

  $('#captureTableBody').innerHTML = rows.map((capture) => {
    const row = capture.first;
    const issues = state.issues.get(capture.index) || [];
    const relevant = suggestion?.captureNames.includes(capture.imageName);
    const orphanRow = state.selectedOrphan && capture.detections.some((item) => item.id === state.selectedOrphan);
    const detectionLabels = capture.detections.map((item) => {
      const linked = suggestion?.detectionIds.includes(item.id);
      const orphaned = state.orphans.some((orphan) => orphan.id === item.id);
      const className = linked ? 'linked-detection' : orphaned ? 'orphan-detection' : '';
      return `<span class="${className}">${classStyle(item.class_label).short}</span>`;
    }).join(' / ');

    return `
      <tr data-capture="${capture.index}" tabindex="0" aria-selected="${capture.index === state.capture}"
        class="${capture.index === state.capture ? 'selected' : ''} ${relevant ? 'relevant' : ''} ${orphanRow ? 'orphan-highlight' : ''}">
        <td class="primary-cell"><span class="capture-index">${String(capture.index + 1).padStart(2, '0')}</span></td>
        <td class="primary-cell">${escapeHtml(capture.imageName)}</td>
        <td>${row.gnss_latitude_deg.toFixed(7)}</td>
        <td>${row.gnss_longitude_deg.toFixed(7)}</td>
        <td>${row.camera_heading_deg.toFixed(1)}°</td>
        <td>${capture.detections.length} · ${detectionLabels}</td>
        <td>${capture.detections.map((item) => `${item.capture_bearing_deg.toFixed(2)}°`).join(' / ')}</td>
        <td><span class="badge ${issues.length ? 'error' : ''}" title="${escapeHtml(issues.join('\n'))}">${issues.length ? `${issues.length} issues` : 'Pass'}</span></td>
      </tr>`;
  }).join('');

  document.querySelectorAll('#captureTableBody tr').forEach((element) => {
    const activate = () => selectCapture(Number(element.dataset.capture));
    element.addEventListener('click', activate);
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });
}

function selectCapture(index) {
  const capture = captures[index];
  if (!capture) return;
  const suggestion = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  if (suggestion && !suggestion.captureNames.includes(capture.imageName)) state.selectedSuggestion = null;
  if (state.selectedOrphan && !capture.detections.some((row) => row.id === state.selectedOrphan)) state.selectedOrphan = null;

  state.capture = index;
  const activeSuggestion = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  const preferred = activeSuggestion
    ? capture.detections.find((row) => activeSuggestion.detectionIds.includes(row.id))
    : state.selectedOrphan ? capture.detections.find((row) => row.id === state.selectedOrphan) : null;
  state.detection = (preferred || capture.detections[0]).id;
  renderSuggestions();
  renderOrphans();
  renderCapture();
  if (state.mapReady && map) {
    map.invalidateSize(false);
    map.setView(captureLatLng(capture), map.getZoom(), { animate: false });
  }
}

function navigateCapture(direction) {
  const available = filteredCaptures();
  if (!available.length) return;
  const currentPosition = available.findIndex((capture) => capture.index === state.capture);
  const nextPosition = (Math.max(0, currentPosition) + direction + available.length) % available.length;
  selectCapture(available[nextPosition].index);
}

function selectDetection(id) {
  state.detection = id;
  renderOverlay();
  renderDetectionStrip();
  updateMapSelection();
}

function selectSuggestion(id) {
  const suggestion = state.suggestions.find((node) => node.id === id);
  if (!suggestion) return;
  state.selectedSuggestion = id;
  state.selectedOrphan = null;
  const capture = captures.find((item) => suggestion.captureNames.includes(item.imageName));
  if (capture) {
    state.capture = capture.index;
    state.detection = capture.detections.find((row) => suggestion.detectionIds.includes(row.id)).id;
  }
  renderSuggestions();
  renderOrphans();
  renderCapture();
  if (state.mapReady) map.panTo([suggestion.lat, suggestion.lon], { animate: false });
}

function updateAddNodeControl() {
  const placing = Boolean(state.pendingNodeClass && state.mapReady);
  $('#addNodeButton').disabled = !state.mapReady;
  $('#addNodeButton').classList.toggle('active', placing);
  $('#nodePlacementHint').hidden = !placing;
  if (!state.mapReady) {
    $('#nodeClassMenu').hidden = true;
    $('#addNodeButton').setAttribute('aria-expanded', 'false');
  }
  if (map) map.getContainer().classList.toggle('placing-node', placing);
}

function addManualSuggestion(classLabel, latLng) {
  const node = {
    id: `M${String(state.manualSuggestions.length + 1).padStart(2, '0')}`,
    classLabel,
    lat: latLng.lat,
    lon: latLng.lng,
    support: 0,
    rms: 0,
    quality: 'Manual',
    detectionIds: [],
    captureNames: [],
    manual: true,
  };
  state.manualSuggestions.push(node);
  state.suggestions.push(node);
  state.pendingNodeClass = null;
  updateAddNodeControl();
  if (state.suggestionClass && state.suggestionClass !== classLabel) {
    state.suggestionClass = '';
    $('#suggestionClassFilter').value = '';
  }
  if (![...$('#suggestionClassFilter').options].some((option) => option.value === classLabel)) {
    $('#suggestionClassFilter').append(new Option(classLabel, classLabel));
  }
  $('#objectCount').textContent = state.suggestions.length;
  renderSuggestions();
  rebuildSuggestionMarkers();
  renderTable();
  selectSuggestion(node.id);
}

function navigateSuggestion(direction) {
  const available = filteredSuggestions();
  if (!available.length) return;
  const currentPosition = available.findIndex((node) => node.id === state.selectedSuggestion);
  const nextPosition = currentPosition === -1
    ? (direction > 0 ? 0 : available.length - 1)
    : (currentPosition + direction + available.length) % available.length;
  selectSuggestion(available[nextPosition].id);
}

function selectOrphan(id) {
  const orphan = state.orphans.find((row) => row.id === id);
  if (!orphan) return;
  state.selectedOrphan = id;
  state.selectedSuggestion = null;
  state.capture = captures.find((capture) => capture.imageName === orphan.image_name).index;
  state.detection = orphan.id;
  renderSuggestions();
  renderOrphans();
  renderCapture();
}

function clearAnalysisFilter() {
  state.selectedSuggestion = null;
  state.selectedOrphan = null;
  renderSuggestions();
  renderOrphans();
  renderTable();
  updateMapSelection();
}

// Local-file project identification. Browser JavaScript cannot override User-Agent.
let projectHeaderFallback = false;
const IdentifiedTileLayer = L.TileLayer.extend({
  createTile(coords, done) {
    const tile = document.createElement('img');
    const url = this.getTileUrl(coords);
    tile.alt = '';
    tile.setAttribute('role', 'presentation');
    let settled = false;

    const imageFallback = () => {
      if (settled) return;
      settled = true;
      tile.onload = () => done(null, tile);
      tile.onerror = (event) => done(event, tile);
      tile.src = url;
    };

    fetch(url, {
      method: 'GET',
      headers: { 'X-Requested-With': PROJECT_REQUEST_ID },
      cache: 'force-cache',
      credentials: 'omit',
    }).then((response) => {
      if (!response.ok) throw new Error(`Tile HTTP ${response.status}`);
      return response.blob();
    }).then((blob) => {
      if (settled) return;
      settled = true;
      const objectUrl = URL.createObjectURL(blob);
      tile.onload = () => { URL.revokeObjectURL(objectUrl); done(null, tile); };
      tile.onerror = (event) => { URL.revokeObjectURL(objectUrl); done(event, tile); };
      tile.src = objectUrl;
    }).catch(() => {
      projectHeaderFallback = true;
      imageFallback();
    });
    return tile;
  },
});

let map = null;
let routeLayer = null;
let captureLayer = null;
let suggestionLayer = null;
let raysLayer = null;
let selectedRayLayer = null;
let selectedCaptureMarker = null;
const captureMarkers = new Map();
const suggestionMarkers = new Map();

function mapStatus(text) {
  $('#mapStatus').className = 'map-status ready';
  $('#mapStatus').innerHTML = `<span>${text}</span>`;
}

function captureLatLng(capture) {
  return [capture.first.gnss_latitude_deg, capture.first.gnss_longitude_deg];
}

function destination(row, distanceM = 80) {
  const angle = row.capture_bearing_deg * Math.PI / 180;
  return unproject({
    x: distanceM * Math.sin(angle),
    y: distanceM * Math.cos(angle),
  }, { lat: row.gnss_latitude_deg, lon: row.gnss_longitude_deg });
}

function rayEndpoint(row) {
  const point = destination(row);
  return [point.lat, point.lon];
}

function addRays(group, rows, selected = false) {
  rows.forEach((row) => {
    L.polyline([
      [row.gnss_latitude_deg, row.gnss_longitude_deg],
      rayEndpoint(row),
    ], {
      color: classStyle(row.class_label).color,
      weight: selected ? 4 : 2,
      opacity: selected ? 0.95 : 0.42,
      dashArray: selected ? null : '6 7',
      interactive: false,
    }).addTo(group);
  });
}

function suggestionIcon(node, selected) {
  const color = classStyle(node.classLabel).color;
  const size = selected ? 16.5 : 12;
  return L.divIcon({
    className: `suggestion-node-marker${selected ? ' selected' : ''}`,
    html: `<span class="suggestion-node-dot" style="background:${color}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function rebuildSuggestionMarkers() {
  if (!map) return;
  if (suggestionLayer) suggestionLayer.clearLayers();
  else suggestionLayer = L.layerGroup().addTo(map);
  suggestionMarkers.clear();

  filteredSuggestions().forEach((node) => {
    const marker = L.marker([node.lat, node.lon], {
      draggable: true,
      icon: suggestionIcon(node, node.id === state.selectedSuggestion),
    }).addTo(suggestionLayer);
    marker.bindPopup(`<strong>Suggested node ${node.id}</strong><br>${escapeHtml(node.classLabel)}<br><small>${node.support} captures · ${node.rms.toFixed(2)} m RMS</small>`);
    marker.on('click', () => selectSuggestion(node.id));
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      node.lat = position.lat;
      node.lon = position.lng;
      renderSuggestions();
      renderTable();
      updateMapSelection();
    });
    suggestionMarkers.set(node.id, marker);
  });
}

function refreshMap() {
  if (map) map.remove();
  map = null;
  state.mapReady = false;
  routeLayer = null;
  captureLayer = null;
  suggestionLayer = null;
  raysLayer = null;
  selectedRayLayer = null;
  selectedCaptureMarker = null;
  captureMarkers.clear();
  suggestionMarkers.clear();
  $('#mapStatus').className = 'map-status';
  $('#mapStatus').innerHTML = '<span>Loading capture map…</span>';
  initMap();
}

function initMap() {
  if (!captures.length) {
    $('#mapStatus').className = 'map-status';
    $('#mapStatus').innerHTML = '<span>Load a capture CSV to display the map.</span>';
    return;
  }
  if (!window.L) {
    $('#mapStatus').innerHTML = '<span>Local map library unavailable. Analysis tables remain functional.</span>';
    return;
  }
  try {
    const centre = currentCapture().first;
    map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: false,
      maxZoom: 24,
    }).setView([centre.gnss_latitude_deg, centre.gnss_longitude_deg], 24);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tiles = new IdentifiedTileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxNativeZoom: 19,
      maxZoom: 24,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: false,
    });
    tiles.on('load', () => mapStatus(projectHeaderFallback ? 'OSM · IMAGE FALLBACK' : 'OSM · PROJECT ID SENT'));
    tiles.on('tileerror', () => mapStatus('OSM TILES UNAVAILABLE · GEOMETRY ACTIVE'));
    tiles.addTo(map);

    routeLayer = L.polyline(captures.map(captureLatLng), {
      color: '#8ca4b8', weight: 3, dashArray: '7 7', opacity: 0.9,
    }).addTo(map);
    raysLayer = L.layerGroup().addTo(map);
    selectedRayLayer = L.layerGroup().addTo(map);
    captureLayer = L.layerGroup().addTo(map);

    captures.forEach((capture) => {
      const marker = L.circleMarker(captureLatLng(capture), {
        radius: 4.5, color: '#d3e0e8', weight: 2, fillColor: '#111a2b', fillOpacity: 1,
      }).addTo(captureLayer);
      marker.bindTooltip(`Capture ${String(capture.index + 1).padStart(2, '0')}`, { direction: 'top', offset: [0, -6] });
      marker.on('click', () => selectCapture(capture.index));
      captureMarkers.set(capture.index, marker);
    });

    rebuildSuggestionMarkers();
    selectedCaptureMarker = L.circleMarker(captureLatLng(currentCapture()), {
      radius: 7.5, color: '#0c1220', weight: 3, fillColor: '#22d3ee', fillOpacity: 1,
    }).addTo(map);

    const bounds = L.latLngBounds(captures.map(captureLatLng));
    state.suggestions.forEach((node) => bounds.extend([node.lat, node.lon]));
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 24, animate: false });
    map.on('click', (event) => {
      if (state.pendingNodeClass) addManualSuggestion(state.pendingNodeClass, event.latlng);
    });
    state.mapReady = true;
    mapStatus('OSM · PROJECT ID SENT');
    updateAddNodeControl();
    updateMapSelection();
  } catch (error) {
    $('#mapStatus').innerHTML = '<span>Map initialization failed. Local analysis remains available.</span>';
  }
}

function updateMapSelection() {
  if (!state.mapReady || !map) return;
  const selectedLatLng = captureLatLng(currentCapture());
  selectedCaptureMarker.setLatLng(selectedLatLng);
  raysLayer.clearLayers();
  selectedRayLayer.clearLayers();

  const suggestion = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  let rows;
  if (suggestion) rows = normalized.filter((row) => suggestion.detectionIds.includes(row.id));
  else if (state.selectedOrphan) rows = normalized.filter((row) => row.id === state.selectedOrphan);
  else rows = $('#allBearings').checked ? normalized : currentCapture().detections;
  addRays(raysLayer, rows);
  addRays(selectedRayLayer, [currentDetection()], true);

  captureMarkers.forEach((marker, index) => {
    const capture = captures[index];
    const relevant = suggestion?.captureNames.includes(capture.imageName);
    const orphanRelevant = state.selectedOrphan && capture.detections.some((row) => row.id === state.selectedOrphan);
    const color = relevant || orphanRelevant ? classStyle(suggestion?.classLabel || currentDetection().class_label).color : '#d3e0e8';
    marker.setStyle({
      radius: relevant || orphanRelevant ? 6 : 4.5,
      color,
      weight: relevant || orphanRelevant ? 3 : 2,
      fillColor: relevant || orphanRelevant ? color : '#111a2b',
    });
  });
  suggestionMarkers.forEach((marker, id) => {
    const node = state.suggestions.find((item) => item.id === id);
    if (node) marker.setIcon(suggestionIcon(node, id === state.selectedSuggestion));
  });
}

function exportValidationReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    projectRequestId: PROJECT_REQUEST_ID,
    dataset: '360 camera drive-past detections',
    conventions: {
      bbox: 'xyxy pixels',
      heading: 'degrees clockwise from true north',
      image: 'Pixel dimensions supplied per detection in the capture CSV',
    },
    intersectionSettings: ANALYSIS,
    summary: {
      captures: captures.length,
      detections: normalized.length,
      suggestedNodes: state.suggestions.length,
      orphanedDetections: state.orphans.length,
      validCaptures: captures.filter((capture) => state.issues.get(capture.index).length === 0).length,
    },
    suggestedNodes: state.suggestions,
    orphanedDetections: state.orphans.map((row) => row.id),
    captures: captures.map((capture) => ({
      capture: capture.index + 1,
      imageName: capture.imageName,
      gnss: {
        latitude: capture.first.gnss_latitude_deg,
        longitude: capture.first.gnss_longitude_deg,
        altitude: capture.first.gnss_altitude_m,
      },
      cameraHeading: capture.first.camera_heading_deg,
      detectionIds: capture.detections.map((row) => row.id),
      issues: state.issues.get(capture.index),
    })),
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '360_camera_validation_report.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('#runValidation').addEventListener('click', () => {
  validateDataset();
  analyseIntersections();
  rebuildSuggestionMarkers();
  renderCapture();
  $('#lastValidated').textContent = `Checks and intersections completed · ${new Date().toLocaleTimeString()}`;
});
$('#previousCapture').addEventListener('click', () => navigateCapture(-1));
$('#nextCapture').addEventListener('click', () => navigateCapture(1));
$('#allBearings').addEventListener('change', updateMapSelection);
$('#suggestionClassFilter').addEventListener('change', (event) => {
  state.suggestionClass = event.target.value;
  const selected = state.suggestions.find((node) => node.id === state.selectedSuggestion);
  if (selected && state.suggestionClass && selected.classLabel !== state.suggestionClass) {
    state.selectedSuggestion = null;
  }
  renderSuggestions();
  rebuildSuggestionMarkers();
  renderTable();
  updateMapSelection();
});
$('#clearSuggestionFilter').addEventListener('click', clearAnalysisFilter);
$('#exportReport').addEventListener('click', exportValidationReport);
$('#addNodeButton').addEventListener('click', () => {
  const menu = $('#nodeClassMenu');
  menu.hidden = !menu.hidden;
  $('#addNodeButton').setAttribute('aria-expanded', String(!menu.hidden));
});
document.querySelectorAll('[data-node-class]').forEach((button) => {
  button.addEventListener('click', () => {
    state.pendingNodeClass = button.dataset.nodeClass;
    $('#nodeClassMenu').hidden = true;
    $('#addNodeButton').setAttribute('aria-expanded', 'false');
    updateAddNodeControl();
  });
});
$('#captureUpload').addEventListener('change', async (event) => {
  const status = $('#captureUploadStatus');
  status.classList.remove('error');
  try {
    const files = [...event.target.files];
    const csvFiles = files.filter((file) => file.name.toLowerCase().endsWith('.csv'));
    if (csvFiles.length !== 1) throw new Error('Select exactly one capture CSV and any images it references.');
    const imageFiles = files.filter((file) => file.type.startsWith('image/') || /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(file.name));
    const rows = parseCsv(await csvFiles[0].text());
    const loadedImages = loadCaptureDataset(rows, imageFiles, './dummy_captures/images/');
    // status.textContent = `${csvFiles[0].name} · ${captures.length} captures · ${loadedImages} images linked from ./images`;
  } catch (error) {
    status.textContent = error.message;
    status.classList.add('error');
  } finally {
    event.target.value = '';
  }
});
$('#imageUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!currentCapture()) {
    $('#stageTag').textContent = 'LOAD A CAPTURE CSV BEFORE SELECTING AN IMAGE';
    event.target.value = '';
    return;
  }
  if (!file.type.startsWith('image/')) {
    $('#stageTag').textContent = 'PLEASE SELECT AN IMAGE FILE';
    return;
  }
  const imageName = currentCapture().imageName;
  const old = state.uploaded.get(imageName);
  if (old?.startsWith('blob:')) URL.revokeObjectURL(old);
  state.uploaded.set(imageName, URL.createObjectURL(file));
  updateImageStage();
  event.target.value = '';
});
document.addEventListener('keydown', (event) => {
  if (event.target.matches('input,textarea,select')) return;
  if (event.key === 'Escape' && state.pendingNodeClass) {
    state.pendingNodeClass = null;
    updateAddNodeControl();
    return;
  }
  if (event.key === 'ArrowLeft') navigateCapture(-1);
  if (event.key === 'ArrowRight') navigateCapture(1);
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    navigateSuggestion(1);
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    navigateSuggestion(-1);
  }
});

$('#captureCount').textContent = captures.length;
$('#detectionCount').textContent = normalized.length;
validateDataset();
analyseIntersections();
renderCapture();
initMap();
$('#lastValidated').textContent = 'Load a capture CSV to begin manual review';
