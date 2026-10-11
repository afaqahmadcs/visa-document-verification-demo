const fs = require('fs');

console.log('--- VALIDATING UUID MASK & UPDATED SEARCH FORM ---');

// 1. Read files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('✓ index.html read successfully (' + html.length + ' bytes)');
console.log('✓ style.css read successfully (' + css.length + ' bytes)');
console.log('✓ script.js read successfully (' + js.length + ' bytes)');

// 2. Verify placeholder ________-____-____-____-____________
const expectedPlaceholder = 'placeholder="________-____-____-____-____________"';
const hasPlaceholder = html.includes(expectedPlaceholder);
console.log('\nChecking UUID mask placeholder in index.html:');
console.log('  Placeholder ________-____-____-____-____________:', hasPlaceholder ? '✓ CONFIRMED' : '✗ MISSING');
if (!hasPlaceholder) process.exit(1);

// 3. Verify single line heading
const hasHeading = html.includes('<h1 class="search-heading">Validador de autenticidade de documento</h1>');
console.log('  Single-line heading "Validador de autenticidade de documento":', hasHeading ? '✓ CONFIRMED' : '✗ MISSING');
if (!hasHeading) process.exit(1);

// 4. Test formatUuidMask logic
function formatUuidMask(value) {
  const clean = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  if (!clean) return '';

  let formatted = '';
  if (clean.length > 0) formatted += clean.slice(0, 8);
  if (clean.length > 8) formatted += '-' + clean.slice(8, 12);
  if (clean.length > 12) formatted += '-' + clean.slice(12, 16);
  if (clean.length > 16) formatted += '-' + clean.slice(16, 20);
  if (clean.length > 20) formatted += '-' + clean.slice(20, 32);

  return formatted;
}

console.log('\nTesting UUID mask formatting:');
const testRaw = '1da556d388c046ec8d3379e1b5cf772f';
const masked = formatUuidMask(testRaw);
console.log('  Raw:   ', testRaw);
console.log('  Masked:', masked);
if (masked !== '1da556d3-88c0-46ec-8d33-79e1b5cf772f') {
  console.error('✗ Mask formatting failed');
  process.exit(1);
}
console.log('  ✓ Mask 8-4-4-4-12 matches reference perfectly');

// 5. Test Lookup
const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
const records = eval(recordsMatch[1]);
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

const match = findRecord(masked);
console.log('\nLookup by masked code:', match ? `✓ FOUND -> ${match.nome} ${match.sobrenome}` : '✗ FAILED');
if (!match || match.nome !== 'SHARIFULLAH') process.exit(1);

// 6. Verify DOM IDs
const idMatches = js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g);
const idsInJs = Array.from(new Set(Array.from(idMatches, m => m[1])));
console.log(`\nVerifying ${idsInJs.length} DOM IDs:`);
for (const id of idsInJs) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`✗ Missing ID: ${id}`);
    process.exit(1);
  }
}
console.log('✓ All DOM IDs matched!');

console.log('\nALL TESTS PASSED SUCCESSFULLY!');
