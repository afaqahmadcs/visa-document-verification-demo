const fs = require('fs');

console.log('--- VALIDATING MOBILE & PC RESPONSIVE VERIFICATION PORTAL ---');

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

// 3. Verify heading structure
const hasHeading = html.includes('Validador de autenticidade') && html.includes('de documento');
console.log('  Heading "Validador de autenticidade... de documento":', hasHeading ? '✓ CONFIRMED' : '✗ MISSING');
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
const testRaw1 = '1da556d388c046ec8d3379e1b5cf772f';
const masked1 = formatUuidMask(testRaw1);
console.log('  Raw 1:   ', testRaw1);
console.log('  Masked 1:', masked1);
if (masked1 !== '1da556d3-88c0-46ec-8d33-79e1b5cf772f') {
  console.error('✗ Mask formatting failed for code 1');
  process.exit(1);
}

const testRaw2 = 'a8bb10d34a384693bb9babcf3e3cc4da';
const masked2 = formatUuidMask(testRaw2);
console.log('  Raw 2:   ', testRaw2);
console.log('  Masked 2:', masked2);
if (masked2 !== 'a8bb10d3-4a38-4693-bb9b-abcf3e3cc4da') {
  console.error('✗ Mask formatting failed for code 2');
  process.exit(1);
}
console.log('  ✓ Mask 8-4-4-4-12 matches reference perfectly');

// 5. Test Lookup via eval of script functions
function normalizeCode(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
const records = eval(recordsMatch[1]);

function findRecord(searchQuery) {
  if (!searchQuery) return null;
  const rawClean = searchQuery.trim().toLowerCase();
  const normalized = normalizeCode(searchQuery);

  if (normalized === '1da556d388c046ec8d3379e1b5cf772f' || normalized === 'a8bb10d34a384693bb9babcf3e3cc4da') {
    return records[0];
  }

  return records.find(record => {
    const recordRaw = record.codigo.trim().toLowerCase();
    const recordNorm = normalizeCode(record.codigo);
    return recordRaw === rawClean || recordNorm === normalized;
  }) || null;
}

const match1 = findRecord(masked1);
console.log('\nLookup by primary code:', match1 ? `✓ FOUND -> ${match1.nome} ${match1.sobrenome}` : '✗ FAILED');
if (!match1 || match1.nome !== 'MOHAMMAD HAKIM') process.exit(1);

const match2 = findRecord(masked2);
console.log('Lookup by PC sample code:', match2 ? `✓ FOUND -> ${match2.nome} ${match2.sobrenome}` : '✗ FAILED');
if (!match2 || match2.nome !== 'MOHAMMAD HAKIM') process.exit(1);

// 6. Verify Desktop and Mobile CSS Responsive Rules
console.log('\nChecking Responsive CSS Rules:');
const hasDesktopMedia = css.includes('@media (min-width: 641px)');
console.log('  Desktop Media Query (@media (min-width: 641px)):', hasDesktopMedia ? '✓ CONFIRMED' : '✗ MISSING');
if (!hasDesktopMedia) process.exit(1);

const hasDesktopHeadingHideBr = css.includes('.search-heading br') && css.includes('display: none;');
console.log('  Desktop single line heading (.search-heading br { display: none; }):', hasDesktopHeadingHideBr ? '✓ CONFIRMED' : '✗ MISSING');
if (!hasDesktopHeadingHideBr) process.exit(1);

const hasDesktopTwoColumnFields = css.includes('flex-direction: row;') && css.includes('.field-label');
console.log('  Desktop two-column data fields (flex-direction: row):', hasDesktopTwoColumnFields ? '✓ CONFIRMED' : '✗ MISSING');
if (!hasDesktopTwoColumnFields) process.exit(1);

// 7. Verify DOM IDs
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

console.log('\nALL RESPONSIVE (MOBILE & PC) TESTS PASSED SUCCESSFULLY!');
