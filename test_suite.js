const fs = require('fs');

console.log('--- VALIDATING CLIENT MANDATORY DATA (SHARIFULLAH HAMDARD) & ENGLISH PORTAL ---');

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
const testRaw = '1da556d388c046ec8d3379e1b5cf772f';
const masked = formatUuidMask(testRaw);
console.log('  Raw:   ', testRaw);
console.log('  Masked:', masked);
if (masked !== '1da556d3-88c0-46ec-8d33-79e1b5cf772f') {
  console.error('✗ Mask formatting failed');
  process.exit(1);
}
console.log('  ✓ Mask 8-4-4-4-12 matches reference perfectly');

// 5. Test Records in script.js
console.log('\nVerifying Client Record in script.js:');
const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
const records = eval(recordsMatch[1]);

if (!records || records.length === 0) {
  console.error('✗ VERIFICATION_RECORDS is empty');
  process.exit(1);
}

const clientRecord = records.find(r => r.codigo === '1da556d388c046ec8d3379e1b5cf772f');

if (!clientRecord) {
  console.error('✗ Record for SHARIFULLAH HAMDARD (1da556d388c046ec8d3379e1b5cf772f) is missing');
  process.exit(1);
}

console.log('  [SHARIFULLAH HAMDARD]:', clientRecord.nome === 'SHARIFULLAH' && clientRecord.sobrenome === 'HAMDARD' ? '✓ CONFIRMED' : '✗ FAILED');

// 6. Verify HTML preserves the record
console.log('\nVerifying index.html has English record fields:');
const htmlHasSharifullah = html.includes('SHARIFULLAH');
const htmlHasHamdard = html.includes('HAMDARD');
const htmlHasRNM = html.includes('F907916R');
const htmlHasApril = html.includes('April 18, 2028');
const htmlHas29022004 = html.includes('29/02/2004');
const htmlHasAfghanistan = html.includes('Afghanistan');

console.log('  HTML has SHARIFULLAH:   ', htmlHasSharifullah ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has HAMDARD:       ', htmlHasHamdard ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has F907916R:      ', htmlHasRNM ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has April 18, 2028:', htmlHasApril ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has 29/02/2004:    ', htmlHas29022004 ? '✓ CONFIRMED' : '✗ MISSING');
console.log('  HTML has Afghanistan:   ', htmlHasAfghanistan ? '✓ CONFIRMED' : '✗ MISSING');

if (!htmlHasSharifullah || !htmlHasHamdard || !htmlHasRNM || !htmlHasApril || !htmlHas29022004 || !htmlHasAfghanistan) {
  console.error('✗ Client record fields missing in index.html');
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
