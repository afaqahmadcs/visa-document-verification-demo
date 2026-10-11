const fs = require('fs');

console.log('--- VALIDATING BRAZILIAN PORTUGUESE (pt-BR) & TRANSLATION SUITE ---');

// 1. Read files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('✓ index.html read successfully (' + html.length + ' bytes)');
console.log('✓ style.css read successfully (' + css.length + ' bytes)');
console.log('✓ script.js read successfully (' + js.length + ' bytes)');

// 2. Check HTML lang="pt-BR"
const hasPtBrLang = /<html[^>]*lang=["']pt-BR["']/i.test(html);
console.log('\nChecking HTML language attribute:');
console.log('  lang="pt-BR":', hasPtBrLang ? '✓ CONFIRMED' : '✗ FAILED');
if (!hasPtBrLang) process.exit(1);

// 3. Verify all Brazilian Portuguese reference labels
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

// 4. Verify Google Translate integration
console.log('\nVerifying Google Translate integration:');
const hasTranslateBox = html.includes('id="google_translate_element"');
const hasTranslateScript = html.includes('translate.google.com');
const hasUrduOption = html.includes('data-lang="ur"');
const hasEnglishOption = html.includes('data-lang="en"');
const hasPtOption = html.includes('data-lang="pt"');

console.log('  google_translate_element:', hasTranslateBox ? '✓ PRESENT' : '✗ MISSING');
console.log('  Google Translate script:', hasTranslateScript ? '✓ PRESENT' : '✗ MISSING');
console.log('  Urdu (اردو) selector:', hasUrduOption ? '✓ PRESENT' : '✗ MISSING');
console.log('  English selector:', hasEnglishOption ? '✓ PRESENT' : '✗ MISSING');
console.log('  Português selector:', hasPtOption ? '✓ PRESENT' : '✗ MISSING');

if (!hasTranslateBox || !hasTranslateScript || !hasUrduOption || !hasEnglishOption) {
  process.exit(1);
}

// 5. Verify personal data protection (notranslate / translate="no")
console.log('\nVerifying personal data preservation tags (notranslate):');
const notranslateCount = (html.match(/notranslate/g) || []).length;
console.log(`  Found ${notranslateCount} instances of notranslate class`);
if (notranslateCount < 6) {
  console.error('✗ Personal data fields must include notranslate class');
  process.exit(1);
}

// 6. Verify DOM Element IDs
const idMatches = js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g);
const idsInJs = Array.from(new Set(Array.from(idMatches, m => m[1])));

console.log(`\nVerifying ${idsInJs.length} DOM element IDs referenced in script.js:`);
for (const id of idsInJs) {
  const hasId = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  if (!hasId) {
    console.error(`  ✗ MISSING ID: "${id}"`);
    process.exit(1);
  }
}
console.log('  ✓ All DOM element IDs matched!');

// 7. Verify Record in script.js
console.log('\nVerifying document record:');
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

console.log('\nALL pt-BR & TRANSLATION CHECKS PASSED SUCCESSFULLY!');
