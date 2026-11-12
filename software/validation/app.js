'use strict';

// Camera detections contain observations only. Physical object identity is inferred below.
const DETECTIONS = [
  {
    "id": "100001",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8900000",
    "gnss_altitude_m": "12.40",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "56.49",
    "image_name": "drive_past_000001.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.96",
    "bbox_x_min": "1552",
    "bbox_y_min": "911",
    "bbox_x_max": "1573",
    "bbox_y_max": "951"
  },
  {
    "id": "100002",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8900000",
    "gnss_altitude_m": "12.40",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "110.83",
    "image_name": "drive_past_000001.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.91",
    "bbox_x_min": "2133",
    "bbox_y_min": "919",
    "bbox_x_max": "2152",
    "bbox_y_max": "941"
  },
  {
    "id": "100003",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8901471",
    "gnss_altitude_m": "12.41",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "49.13",
    "image_name": "drive_past_000002.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.96",
    "bbox_x_min": "1472",
    "bbox_y_min": "902",
    "bbox_x_max": "1496",
    "bbox_y_max": "949"
  },
  {
    "id": "100004",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8901471",
    "gnss_altitude_m": "12.41",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "114.58",
    "image_name": "drive_past_000002.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.93",
    "bbox_x_min": "2173",
    "bbox_y_min": "915",
    "bbox_x_max": "2192",
    "bbox_y_max": "936"
  },
  {
    "id": "100005",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8902943",
    "gnss_altitude_m": "12.42",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "40.13",
    "image_name": "drive_past_000003.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.95",
    "bbox_x_min": "1374",
    "bbox_y_min": "892",
    "bbox_x_max": "1402",
    "bbox_y_max": "947"
  },
  {
    "id": "100006",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8902943",
    "gnss_altitude_m": "12.42",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "118.87",
    "image_name": "drive_past_000003.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.94",
    "bbox_x_min": "2218",
    "bbox_y_min": "909",
    "bbox_x_max": "2237",
    "bbox_y_max": "931"
  },
  {
    "id": "100007",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8904414",
    "gnss_altitude_m": "12.43",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "26.45",
    "image_name": "drive_past_000004.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.95",
    "bbox_x_min": "1226",
    "bbox_y_min": "881",
    "bbox_x_max": "1258",
    "bbox_y_max": "945"
  },
  {
    "id": "100008",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8904414",
    "gnss_altitude_m": "12.43",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "125.82",
    "image_name": "drive_past_000004.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.95",
    "bbox_x_min": "2291",
    "bbox_y_min": "899",
    "bbox_x_max": "2313",
    "bbox_y_max": "924"
  },
  {
    "id": "100009",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8905885",
    "gnss_altitude_m": "12.44",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "9.54",
    "image_name": "drive_past_000005.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.94",
    "bbox_x_min": "1044",
    "bbox_y_min": "873",
    "bbox_x_max": "1080",
    "bbox_y_max": "943"
  },
  {
    "id": "100010",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8905885",
    "gnss_altitude_m": "12.44",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "134.91",
    "image_name": "drive_past_000005.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.96",
    "bbox_x_min": "2386",
    "bbox_y_min": "886",
    "bbox_x_max": "2412",
    "bbox_y_max": "917"
  },
  {
    "id": "100011",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8907356",
    "gnss_altitude_m": "12.45",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "350.32",
    "image_name": "drive_past_000006.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.93",
    "bbox_x_min": "839",
    "bbox_y_min": "873",
    "bbox_x_max": "874",
    "bbox_y_max": "943"
  },
  {
    "id": "100012",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8907356",
    "gnss_altitude_m": "12.45",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "149.23",
    "image_name": "drive_past_000006.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.96",
    "bbox_x_min": "2536",
    "bbox_y_min": "871",
    "bbox_x_max": "2568",
    "bbox_y_max": "907"
  },
  {
    "id": "100013",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8908828",
    "gnss_altitude_m": "12.46",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "333.68",
    "image_name": "drive_past_000007.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.92",
    "bbox_x_min": "663",
    "bbox_y_min": "881",
    "bbox_x_max": "695",
    "bbox_y_max": "945"
  },
  {
    "id": "100014",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8908828",
    "gnss_altitude_m": "12.46",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "168.38",
    "image_name": "drive_past_000007.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.95",
    "bbox_x_min": "2738",
    "bbox_y_min": "858",
    "bbox_x_max": "2774",
    "bbox_y_max": "900"
  },
  {
    "id": "100015",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8910299",
    "gnss_altitude_m": "12.47",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "320.03",
    "image_name": "drive_past_000008.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.90",
    "bbox_x_min": "520",
    "bbox_y_min": "892",
    "bbox_x_max": "548",
    "bbox_y_max": "947"
  },
  {
    "id": "100016",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8910299",
    "gnss_altitude_m": "12.47",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "191.44",
    "image_name": "drive_past_000008.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.93",
    "bbox_x_min": "2984",
    "bbox_y_min": "858",
    "bbox_x_max": "3020",
    "bbox_y_max": "900"
  },
  {
    "id": "100017",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8911770",
    "gnss_altitude_m": "12.48",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "310.71",
    "image_name": "drive_past_000009.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.87",
    "bbox_x_min": "422",
    "bbox_y_min": "902",
    "bbox_x_max": "446",
    "bbox_y_max": "949"
  },
  {
    "id": "100018",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8911770",
    "gnss_altitude_m": "12.48",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "210.81",
    "image_name": "drive_past_000009.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.90",
    "bbox_x_min": "3193",
    "bbox_y_min": "871",
    "bbox_x_max": "3225",
    "bbox_y_max": "907"
  },
  {
    "id": "100019",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8913242",
    "gnss_altitude_m": "12.49",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "303.40",
    "image_name": "drive_past_000010.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.82",
    "bbox_x_min": "346",
    "bbox_y_min": "911",
    "bbox_x_max": "366",
    "bbox_y_max": "951"
  },
  {
    "id": "100020",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8913242",
    "gnss_altitude_m": "12.49",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "225.24",
    "image_name": "drive_past_000010.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "dome surveillance camera",
    "confidence": "0.86",
    "bbox_x_min": "3349",
    "bbox_y_min": "886",
    "bbox_x_max": "3376",
    "bbox_y_max": "917"
  },
  {
    "id": "100021",
    "gnss_latitude_deg": "52.3700000",
    "gnss_longitude_deg": "4.8913242",
    "gnss_altitude_m": "12.49",
    "camera_heading_deg": "90.0",
    "capture_bearing_deg": "180.00",
    "image_name": "drive_past_000010.jpg",
    "image_width_px": "3840",
    "image_height_px": "1920",
    "class_label": "surveillance camera",
    "confidence": "0.68",
    "bbox_x_min": "2870",
    "bbox_y_min": "900",
    "bbox_x_max": "2890",
    "bbox_y_max": "940"
  }
];

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
  filter: '',
  mapReady: false,
  uploaded: new Map(),
  suggestions: [],
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

const normalized = DETECTIONS.map((row) => ({
  ...row,
  id: toNumber(row.id),
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

const imageNames = [...new Set(normalized.map((row) => row.image_name))];

const captures = imageNames.map((imageName, index) => {
  const detections = normalized.filter((row) => row.image_name === imageName);
  return { index, imageName, detections, first: detections[0] };
});
state.detection = captures[0]?.detections[0]?.id ?? null;

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

  state.suggestions = suggestions;
  state.detectionToSuggestion = new Map();
  suggestions.forEach((suggestion) => suggestion.detectionIds.forEach((id) => {
    state.detectionToSuggestion.set(id, suggestion.id);
  }));
  const linkedIds = new Set(suggestions.flatMap((suggestion) => suggestion.detectionIds));
  state.orphans = normalized.filter((row) => !linkedIds.has(row.id));

  if (state.selectedSuggestion && !suggestions.some((node) => node.id === state.selectedSuggestion)) {
    state.selectedSuggestion = null;
  }
  if (state.selectedOrphan && !state.orphans.some((row) => row.id === state.selectedOrphan)) {
    state.selectedOrphan = null;
  }
  $('#objectCount').textContent = suggestions.length;
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
  $('#validCount').textContent = `${valid} / ${captures.length}`;
  renderTable();
}

function renderPanorama(capture) {
  const heading = capture.first.camera_heading_deg;
  $('#panorama').innerHTML = `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#16263a"/><stop offset="1" stop-color="#284252"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1c2b30"/><stop offset="1" stop-color="#090f16"/>
      </linearGradient>
      <pattern id="microgrid" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M120 0H0V120" fill="none" stroke="#8eb5c2" stroke-opacity=".08" stroke-width="2"/>
      </pattern>
    </defs>
    <rect width="3840" height="960" fill="url(#sky)"/>
    <rect y="960" width="3840" height="960" fill="url(#ground)"/>
    <rect width="3840" height="1920" fill="url(#microgrid)"/>
    <path d="M0 950 400 810 800 900 1200 740 1600 920 2000 790 2400 910 2800 750 3200 900 3840 820V1100H0Z" fill="#101d28" opacity=".9"/>
    <g fill="#142631" stroke="#3d5964" stroke-width="3">
      <path d="M100 950V620h330v330M510 950V700h250v250M880 950V550h390v400M1400 950V680h260v270M1790 950V590h360v360M2320 950V720h290v230M2780 950V570h400v380M3330 950V670h300v280"/>
    </g>
    <g fill="#7ca0a8" opacity=".28">
      ${Array.from({ length: 24 }, (_, index) => `<rect x="${150 + index * 151}" y="${690 + (index % 3) * 55}" width="46" height="30"/>`).join('')}
    </g>
    <path d="M0 1160Q960 1070 1920 1160T3840 1160V1530Q2880 1410 1920 1510T0 1530Z" fill="#172129"/>
    <path d="M0 1340Q960 1250 1920 1340T3840 1340" fill="none" stroke="#b8c3af" stroke-opacity=".35" stroke-width="9" stroke-dasharray="70 60"/>
    <path d="M0 960H3840" stroke="#87acb7" stroke-opacity=".32" stroke-width="3"/>
    ${[-180, -90, 0, 90, 180].map((angle) => {
      const x = (angle + 180) / 360 * 3840;
      const label = angle === 0 ? `CAM ${heading}°` : `${angle > 0 ? '+' : ''}${angle}°`;
      return `<path d="M${x} 0V1920" stroke="#9ed4df" stroke-opacity="${angle === 0 ? 0.24 : 0.09}" stroke-width="${angle === 0 ? 4 : 2}" stroke-dasharray="16 20"/>
        <text x="${x + 18}" y="80" fill="#a9c0ca" opacity=".65" font-size="34" font-family="monospace">${label}</text>`;
    }).join('')}
    <g font-family="monospace" fill="#b9cbd3">
      <text x="40" y="1840" font-size="30" opacity=".6">EQUIRECTANGULAR SCHEMATIC · LOAD THE SOURCE IMAGE FOR VISUAL INSPECTION</text>
      <text x="40" y="120" font-size="38" opacity=".8">${escapeHtml(capture.imageName)}</text>
    </g>`;
}

function renderOverlay() {
  $('#detectionOverlay').innerHTML = currentCapture().detections.map((row) => {
    const color = classStyle(row.class_label).color;
    const selected = row.id === state.detection;
    const labelY = Math.max(52, row.bbox_y_min - 18);
    return `
      <g class="detection-box ${selected ? 'selected' : ''}" data-detection="${row.id}" style="color:${color}" opacity="${selected ? 1 : 0.72}">
        <rect x="${row.bbox_x_min}" y="${row.bbox_y_min}" width="${row.bbox_x_max - row.bbox_x_min}" height="${row.bbox_y_max - row.bbox_y_min}"
          fill="${color}" fill-opacity="${selected ? 0.1 : 0.03}" stroke="${color}" stroke-width="${selected ? 7 : 4}"/>
        <rect x="${row.bbox_x_min}" y="${labelY - 45}" width="${Math.max(390, row.class_label.length * 24)}" height="58" fill="#0c1220" fill-opacity=".9"/>
        <text x="${row.bbox_x_min + 12}" y="${labelY - 7}" fill="${color}" font-size="32" font-family="monospace">
          ${escapeHtml(row.class_label)} · ${(row.confidence * 100).toFixed(0)}%
        </text>
      </g>`;
  }).join('');
  document.querySelectorAll('.detection-box').forEach((element) => {
    element.addEventListener('click', () => selectDetection(Number(element.dataset.detection)));
  });
}

function renderDetectionStrip() {
  $('#detectionStrip').innerHTML = currentCapture().detections.map((row) => {
    const nodeId = state.detectionToSuggestion.get(row.id);
    return `
      <button type="button" class="detection-chip ${row.id === state.detection ? 'active' : ''}" data-detection="${row.id}">
        <strong>${escapeHtml(row.class_label)}</strong>
        <span>${row.capture_bearing_deg.toFixed(2)}° · ${nodeId ? `node ${nodeId}` : 'orphaned'}</span>
      </button>`;
  }).join('');
  document.querySelectorAll('.detection-chip').forEach((element) => {
    element.addEventListener('click', () => selectDetection(Number(element.dataset.detection)));
  });
}

function updateImageStage() {
  const url = state.uploaded.get(state.capture);
  const image = $('#uploadedImage');
  if (url) {
    image.src = url;
    image.hidden = false;
    $('#panorama').hidden = true;
    $('#stageTag').textContent = 'LOCAL IMAGE · 3840 × 1920 COORDINATES';
  } else {
    image.hidden = true;
    image.removeAttribute('src');
    $('#panorama').hidden = false;
    $('#stageTag').textContent = 'SCHEMATIC PANORAMA · 3840 × 1920';
  }
}

function renderCapture() {
  const capture = currentCapture();
  const row = capture.first;
  $('#captureLabel').textContent = `Capture ${String(state.capture + 1).padStart(2, '0')} / ${captures.length}`;
  $('#metaImage').textContent = capture.imageName;
  $('#metaImage').title = capture.imageName;
  $('#metaGnss').textContent = `${row.gnss_latitude_deg.toFixed(7)}, ${row.gnss_longitude_deg.toFixed(7)}`;
  $('#metaHeading').textContent = `${row.camera_heading_deg.toFixed(1)}° · ${row.gnss_altitude_m.toFixed(2)} m`;
  renderPanorama(capture);
  updateImageStage();
  renderOverlay();
  renderDetectionStrip();
  renderTable();
  updateMapSelection();
}

function renderSuggestions() {
  $('#suggestionCount').textContent = `${state.suggestions.length} node${state.suggestions.length === 1 ? '' : 's'}`;
  $('#emptySuggestions').hidden = state.suggestions.length > 0;
  $('#suggestionTableBody').innerHTML = state.suggestions.map((node) => `
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
    <button type="button" class="orphan-item ${row.id === state.selectedOrphan ? 'selected' : ''}" data-orphan="${row.id}">
      ${escapeHtml(row.image_name)} · ${escapeHtml(row.class_label)} · ${row.capture_bearing_deg.toFixed(2)}°
    </button>`).join('');
  document.querySelectorAll('.orphan-item').forEach((element) => {
    element.addEventListener('click', () => selectOrphan(Number(element.dataset.orphan)));
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

  const query = state.filter.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((capture) => [
    capture.imageName,
    capture.first.gnss_latitude_deg,
    capture.first.gnss_longitude_deg,
    ...capture.detections.map((row) => row.class_label),
  ].join(' ').toLowerCase().includes(query));
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
  state.capture = capture.index;
  state.detection = capture.detections.find((row) => suggestion.detectionIds.includes(row.id)).id;
  renderSuggestions();
  renderOrphans();
  renderCapture();
  if (state.mapReady) map.panTo([suggestion.lat, suggestion.lon], { animate: false });
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
  const suggestionId = state.detectionToSuggestion.get(row.id);
  const suggestion = state.suggestions.find((node) => node.id === suggestionId);
  return suggestion ? [suggestion.lat, suggestion.lon] : (() => {
    const point = destination(row);
    return [point.lat, point.lon];
  })();
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

function rebuildSuggestionMarkers() {
  if (!map) return;
  if (suggestionLayer) suggestionLayer.clearLayers();
  else suggestionLayer = L.layerGroup().addTo(map);
  suggestionMarkers.clear();

  state.suggestions.forEach((node) => {
    const color = classStyle(node.classLabel).color;
    const marker = L.circleMarker([node.lat, node.lon], {
      radius: node.id === state.selectedSuggestion ? 11 : 8,
      color: '#f1f5f7',
      weight: node.id === state.selectedSuggestion ? 3 : 2,
      fillColor: color,
      fillOpacity: 1,
    }).addTo(suggestionLayer);
    marker.bindPopup(`<strong>Suggested node ${node.id}</strong><br>${escapeHtml(node.classLabel)}<br><small>${node.support} captures · ${node.rms.toFixed(2)} m RMS</small>`);
    marker.on('click', () => selectSuggestion(node.id));
    suggestionMarkers.set(node.id, marker);
  });
}

function initMap() {
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
    }).setView([centre.gnss_latitude_deg, centre.gnss_longitude_deg], 15);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tiles = new IdentifiedTileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
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
        radius: 6, color: '#d3e0e8', weight: 2, fillColor: '#111a2b', fillOpacity: 1,
      }).addTo(captureLayer);
      marker.bindTooltip(`Capture ${String(capture.index + 1).padStart(2, '0')}`, { direction: 'top', offset: [0, -6] });
      marker.on('click', () => selectCapture(capture.index));
      captureMarkers.set(capture.index, marker);
    });

    rebuildSuggestionMarkers();
    selectedCaptureMarker = L.circleMarker(captureLatLng(currentCapture()), {
      radius: 10, color: '#0c1220', weight: 3, fillColor: '#22d3ee', fillOpacity: 1,
    }).addTo(map);

    const bounds = L.latLngBounds(captures.map(captureLatLng));
    state.suggestions.forEach((node) => bounds.extend([node.lat, node.lon]));
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 16, animate: false });
    state.mapReady = true;
    mapStatus('OSM · PROJECT ID SENT');
    updateMapSelection();
  } catch (error) {
    $('#mapStatus').innerHTML = '<span>Map initialization failed. Local analysis remains available.</span>';
  }
}

function updateMapSelection() {
  if (!state.mapReady || !map) return;
  selectedCaptureMarker.setLatLng(captureLatLng(currentCapture()));
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
      radius: relevant || orphanRelevant ? 8 : 6,
      color,
      weight: relevant || orphanRelevant ? 3 : 2,
      fillColor: relevant || orphanRelevant ? color : '#111a2b',
    });
  });
  suggestionMarkers.forEach((marker, id) => {
    const selected = id === state.selectedSuggestion;
    marker.setStyle({ radius: selected ? 11 : 8, weight: selected ? 3 : 2 });
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
      image: '3840 × 1920 equirectangular',
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
$('#captureSearch').addEventListener('input', (event) => {
  state.filter = event.target.value;
  renderTable();
});
$('#clearSuggestionFilter').addEventListener('click', clearAnalysisFilter);
$('#exportReport').addEventListener('click', exportValidationReport);
$('#imageUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    $('#stageTag').textContent = 'PLEASE SELECT AN IMAGE FILE';
    return;
  }
  const old = state.uploaded.get(state.capture);
  if (old) URL.revokeObjectURL(old);
  state.uploaded.set(state.capture, URL.createObjectURL(file));
  updateImageStage();
  event.target.value = '';
});
document.addEventListener('keydown', (event) => {
  if (event.target.matches('input,textarea,select')) return;
  if (event.key === 'ArrowLeft') navigateCapture(-1);
  if (event.key === 'ArrowRight') navigateCapture(1);
});

$('#captureCount').textContent = captures.length;
$('#detectionCount').textContent = normalized.length;
validateDataset();
analyseIntersections();
renderCapture();
initMap();
$('#lastValidated').textContent = 'Automatic checks and intersections complete';
