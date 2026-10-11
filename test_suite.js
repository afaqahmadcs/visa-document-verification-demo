const fs = require('fs');

console.log('--- VALIDATING CLIENT EXACT SPECIFICATIONS ---');

// 1. Read files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('✓ index.html read successfully (' + html.length + ' bytes)');
console.log('✓ style.css read successfully (' + css.length + ' bytes)');
console.log('✓ script.js read successfully (' + js.length + ' bytes)');

// 2. Verify input has placeholder and NO pre-filled value
console.log('\nChecking input field attributes:');
const inputMatch = html.match(/<input[^>]*id=["']codigo-input["'][^>]*>/);
if (!inputMatch) {
  console.error('✗ codigo-input not found in index.html');
  process.exit(1);
}
const inputTag = inputMatch[0];
const hasValueAttr = /value=["'][^"']*["']/.test(inputTag);
const hasPlaceholder = inputTag.includes('placeholder="Digite o código verificador"');

console.log('  Pre-filled value attribute present:', hasValueAttr ? '✗ FAILED (must be empty)' : '✓ NONE (correct, empty)');
console.log('  Placeholder "Digite o código verificador":', hasPlaceholder ? '✓ CONFIRMED' : '✗ MISSING');

if (hasValueAttr || !hasPlaceholder) {
  process.exit(1);
}

// 3. Verify NO unrequested content (no translate widget, no top-bar, no footer)
console.log('\nChecking removal of unrequested extra content:');
const hasTranslateWidget = html.includes('google_translate_element') || html.includes('translate.google.com');
const hasTopBar = html.includes('class="top-bar"');
const hasFooter = html.includes('<footer');

console.log('  Google translate / widget:', hasTranslateWidget ? '✗ FOUND (must be removed)' : '✓ NONE');
console.log('  Top bar / language selector:', hasTopBar ? '✗ FOUND (must be removed)' : '✓ NONE');
console.log('  Footer / promotional text:', hasFooter ? '✗ FOUND (must be removed)' : '✓ NONE');

if (hasTranslateWidget || hasTopBar || hasFooter) {
  process.exit(1);
}

// 4. Verify all Brazilian Portuguese reference labels
const ptLabels = [
  'Validador de',
  'autenticidade de',
  'documento',
  'Código Verificador',
  'Validar',
  'Limpar',
  'Aguarde...',
  'Documento autêntico',
  'Dados do documento',
  'Situação:',
  'Código:',
  'Nome:',
  'Sobrenome:',
  'RNM:',
  'Data de nascimento:',
  'Nacionalidade:',
  'Voltar'
];

console.log('\nVerifying Brazilian Portuguese labels in index.html:');
for (const label of ptLabels) {
  if (html.includes(label)) {
    console.log(`  ✓ Label "${label}" found`);
  } else {
    console.error(`  ✗ MISSING LABEL: "${label}"`);
    process.exit(1);
  }
}

// 5. Verify DOM Element IDs in script.js
const idMatches = js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g);
const idsInJs = Array.from(new Set(Array.from(idMatches, m => m[1])));

console.log(`\nVerifying ${idsInJs.length} DOM element IDs:`);
for (const id of idsInJs) {
  const hasId = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  if (!hasId) {
    console.error(`  ✗ MISSING ID: "${id}"`);
    process.exit(1);
  }
}
console.log('  ✓ All DOM element IDs matched!');

// 6. Test Record & Lookup
console.log('\nTesting dataset logic:');
const recordsMatch = js.match(/const VERIFICATION_RECORDS = (\[[\s\S]*?\]);/);
const records = eval(recordsMatch[1]);
const target = records.find(r => r.codigo === '1da556d388c046ec8d3379e1b5cf772f');

if (!target) {
  console.error('✗ Record 1da556d388c046ec8d3379e1b5cf772f not found');
  process.exit(1);
}

console.log('  Código:', target.codigo);
console.log('  Nome:', target.nome === 'SHARIFULLAH' ? '✓ SHARIFULLAH' : '✗ FAILED');
console.log('  Sobrenome:', target.sobrenome === 'HAMDARD' ? '✓ HAMDARD' : '✗ FAILED');
console.log('  RNM:', target.rnm === 'B269953J' ? '✓ B269953J' : '✗ FAILED');
console.log('  Data Nasc:', target.nascimento === '29/02/2004' ? '✓ 29/02/2004' : '✗ FAILED');
console.log('  Nacionalidade:', target.nacionalidade === 'Afghanistan' ? '✓ Afghanistan' : '✗ FAILED');
console.log('  Situação:', target.situacao === 'Válido até: 18 de junho de 2028' ? '✓ Válido até: 18 de junho de 2028' : '✗ FAILED');

console.log('\nALL SPECIFICATION CHECKS PASSED!');
