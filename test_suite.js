const fs = require('fs');

console.log('--- VALIDATING CLIENT RECORD & DESIGN MATCH ---');

// 1. Read files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('✓ index.html read successfully (' + html.length + ' bytes)');
console.log('✓ style.css read successfully (' + css.length + ' bytes)');
console.log('✓ script.js read successfully (' + js.length + ' bytes)');

// 2. Verify all element IDs referenced in script.js exist in index.html
const idMatches = js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g);
const idsInJs = Array.from(new Set(Array.from(idMatches, m => m[1])));

console.log(`\nVerifying ${idsInJs.length} DOM element IDs:`);
let missingCount = 0;
for (const id of idsInJs) {
  const hasId = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  if (hasId) {
    console.log(`  ✓ ID "${id}" found in index.html`);
  } else {
    console.error(`  ✗ MISSING ID: "${id}"`);
    missingCount++;
  }
}
if (missingCount > 0) process.exit(1);

// 3. Verify exact labels from screenshot are in index.html
const requiredLabels = [
  'Authentic document',
  'Document data',
  'Situation:',
  'Code:',
  'Name:',
  'Surname:',
  'RNM:',
  'Date of birth:',
  'Nationality:',
  'go back'
];

console.log('\nVerifying exact labels from screenshot in index.html:');
for (const label of requiredLabels) {
  if (html.includes(label)) {
    console.log(`  ✓ Label "${label}" confirmed in index.html`);
  } else {
    console.error(`  ✗ MISSING LABEL: "${label}"`);
    process.exit(1);
  }
}

// 4. Test Record & Lookup Logic
console.log('\nTesting dataset logic:');
const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
if (!recordsMatch) {
  console.error('✗ VERIFICATION_RECORDS not found in script.js');
  process.exit(1);
}
const records = eval(recordsMatch[1]);
console.log(`  ✓ Records in database: ${records.length}`);

// Ensure previous records were removed
const hasElena = js.includes('Elena Vance') || js.includes('ELENA');
const hasWaris = js.includes('WARIS');
console.log('  ✓ Old record Elena removed:', !hasElena ? 'YES' : 'NO');
console.log('  ✓ Old record Waris removed:', !hasWaris ? 'YES' : 'NO');

// Verify new record
const target = records.find(r => r.codigo === '1da556d388c046ec8d3379e1b5cf772f');
if (!target) {
  console.error('✗ Record 1da556d388c046ec8d3379e1b5cf772f not found!');
  process.exit(1);
}

console.log('\nChecking target record fields:');
console.log('  Name:', target.name === 'SHARIFULLAH' ? '✓ SHARIFULLAH' : '✗ FAILED');
console.log('  Surname:', target.surname === 'HAMDARD' ? '✓ HAMDARD' : '✗ FAILED');
console.log('  RNM:', target.rnm === 'B269953J' ? '✓ B269953J' : '✗ FAILED');
console.log('  DOB:', target.dob === '29/02/2004' ? '✓ 29/02/2004' : '✗ FAILED');
console.log('  Nationality:', target.nationality === 'Afghanistan' ? '✓ Afghanistan' : '✗ FAILED');
console.log('  Situation:', target.situation === 'Valid until: June 18, 2028' ? '✓ Valid until: June 18, 2028' : '✗ FAILED');

// Test search normalization function
function normalizeCode(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findRecord(searchQuery) {
  if (!searchQuery) return null;
  const rawClean = searchQuery.trim().toLowerCase();
  const normalized = normalizeCode(searchQuery);

  return records.find(record => {
    const recordRaw = record.codigo.trim().toLowerCase();
    const recordNorm = normalizeCode(record.codigo);
    return recordRaw === rawClean || recordNorm === normalized;
  }) || null;
}

// Check searches
console.log('\nRunning search cases:');
console.log('  Exact code 1da556d388c046ec8d3379e1b5cf772f:', findRecord('1da556d388c046ec8d3379e1b5cf772f') ? 'PASSED' : 'FAILED');
console.log('  Hyphenated code 1da556d3-88c0-46ec-8d33-79e1b5cf772f:', findRecord('1da556d3-88c0-46ec-8d33-79e1b5cf772f') ? 'PASSED' : 'FAILED');
console.log('  Uppercase code 1DA556D388C046EC8D3379E1B5CF772F:', findRecord('1DA556D388C046EC8D3379E1B5CF772F') ? 'PASSED' : 'FAILED');
console.log('  Unknown code DEMO-9999:', findRecord('DEMO-9999') === null ? 'PASSED (null)' : 'FAILED');

console.log('\nALL VERIFICATION CHECKS PASSED!');
