const fs = require('fs');

console.log('--- VALIDATING CLIENT MANDATORY DATA (WARIS & SHARIFULLAH) & ENGLISH PORTAL ---');

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

// 3. Verify heading structure in English
const hasHeading = html.includes('Document') && html.includes('authenticity') && html.includes('validator');
console.log('  Heading "Document authenticity validator":', hasHeading ? '✓ CONFIRMED' : '✗ MISSING');
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
const testRaw = 'a8bb10d34a384693bb9babcf3e3cc4da';
const masked = formatUuidMask(testRaw);
console.log('  Raw:   ', testRaw);
console.log('  Masked:', masked);
if (masked !== 'a8bb10d3-4a38-4693-bb9b-abcf3e3cc4da') {
  console.error('✗ Mask formatting failed');
  process.exit(1);
}
console.log('  ✓ Mask 8-4-4-4-12 matches reference perfectly');

// 5. Test Records in script.js
console.log('\nVerifying Client Records in script.js:');
const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
const records = eval(recordsMatch[1]);

if (!records || records.length === 0) {
  console.error('✗ VERIFICATION_RECORDS is empty');
  process.exit(1);
}

const warisRecord = records.find(r => r.codigo === 'a8bb10d34a384693bb9babcf3e3cc4da');
const sharifullahRecord = records.find(r => r.codigo === '1da556d388c046ec8d3379e1b5cf772f');

if (!warisRecord) {
  console.error('✗ Record for WARIS MUHAMMADI (a8bb10d34a384693bb9babcf3e3cc4da) is missing');
  process.exit(1);
}
if (!sharifullahRecord) {
  console.error('✗ Record for SHARIFULLAH HAMDARD (1da556d388c046ec8d3379e1b5cf772f) is missing');
  process.exit(1);
}

console.log('  [WARIS MUHAMMADI]:', warisRecord.nome === 'WARIS' && warisRecord.sobrenome === 'MUHAMMADI' ? '✓ CONFIRMED' : '✗ FAILED');
console.log('  [SHARIFULLAH HAMDARD]:', sharifullahRecord.nome === 'SHARIFULLAH' && sharifullahRecord.sobrenome === 'HAMDARD' ? '✓ CONFIRMED' : '✗ FAILED');

// 6. Verify HTML preserves the primary record
console.log('\nVerifying index.html has English primary record fields:');
const htmlHasWaris = html.includes('WARIS');
const htmlHasMuhammadi = html.includes('MUHAMMADI');
const htmlHasB269953J = html.includes('B269953J');
const htmlHasInactive = html.includes('Inactive');
const htmlHasAfghanistan = html.includes('Afghanistan');

console.log('  HTML has WARIS:       ', htmlHasWaris ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has MUHAMMADI:   ', htmlHasMuhammadi ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has B269953J:    ', htmlHasB269953J ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has Inactive:    ', htmlHasInactive ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has Afghanistan: ', htmlHasAfghanistan ? '✓ CONFIRMED' : '✗ MISSING');

if (!htmlHasWaris || !htmlHasMuhammadi || !htmlHasB269953J || !htmlHasInactive || !htmlHasAfghanistan) {
  console.error('✗ Primary record fields missing in index.html');
  process.exit(1);
}

// 7. Verify Responsive CSS Rules
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

// 8. Verify DOM IDs
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

console.log('\nALL CLIENT DATA & ENGLISH CHECKS PASSED SUCCESSFULLY!');
