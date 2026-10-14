/**
 * Validador de Autenticidade de Documento
 * Português do Brasil (pt-BR) - Formatação com Máscara UUID
 */

'use strict';

/* ==========================================================================
   Base de Dados de Validação de Documentos
   ========================================================================== */
const VERIFICATION_RECORDS = [
  {
    codigo: '1da662d388c046ec8d5579e1b5cf774f',
    situacao: 'Valid until: April 18, 2028',
    nome: 'SHARIFULLAH',
    sobrenome: 'HAMDARD',
    rnm: 'F907916R',
    nascimento: '29/02/2004',
    nacionalidade: 'Afghanistan'
  }
];

/* ==========================================================================
   Seletores de Elementos do DOM
   ========================================================================== */
// Visualizações
const searchView = document.getElementById('search-view');
const resultView = document.getElementById('result-view');
const notFoundView = document.getElementById('notfound-view');
const loadingOverlay = document.getElementById('loading-overlay');

// Formulário de Consulta
const form = document.getElementById('verification-form');
const input = document.getElementById('codigo-input');
const inputGroup = input ? input.closest('.input-group') : null;
const inputError = document.getElementById('input-error');
const btnValidar = document.getElementById('btn-validar');
const btnLimpar = document.getElementById('btn-limpar');

// Campos do Resultado
const valSituacao = document.getElementById('val-situacao');
const valCodigo = document.getElementById('val-codigo');
const valNome = document.getElementById('val-nome');
const valSobrenome = document.getElementById('val-sobrenome');
const valRnm = document.getElementById('val-rnm');
const valNascimento = document.getElementById('val-nascimento');
const valNacionalidade = document.getElementById('val-nacionalidade');

// Campo de Código Não Localizado
const valMissingCode = document.getElementById('val-missing-code');

// Botões de Voltar
const btnVoltar = document.getElementById('btn-voltar');
const btnVoltarNotFound = document.getElementById('btn-voltar-notfound');

/* ==========================================================================
   Funções de Máscara e Normalização
   ========================================================================== */

/**
 * Formata os caracteres digitados no padrão UUID 8-4-4-4-12
 */
function formatUuidMask(value) {
  // Mantém apenas caracteres alfanuméricos hexadecimais
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

/**
 * Normaliza o código eliminando espaços e hífens para busca
 */
function normalizeCode(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Recupera todos os registros (padrão do sistema + registros adicionados pelo administrador)
 */
function getAllRecords() {
  let custom = [];
  try {
    const saved = localStorage.getItem('VERIFICATION_RECORDS_CUSTOM');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        custom = parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar registros personalizados do localStorage:', err);
  }

  const codeMap = new Map();
  VERIFICATION_RECORDS.forEach(r => codeMap.set(r.codigo.toLowerCase(), r));
  custom.forEach(r => codeMap.set(r.codigo.toLowerCase(), r));

  return Array.from(codeMap.values());
}

/**
 * Localiza o registro correspondente no repositório
 */
function findRecord(searchQuery) {
  if (!searchQuery) return null;
  const rawClean = searchQuery.trim().toLowerCase();
  const normalized = normalizeCode(searchQuery);

  const allRecords = getAllRecords();
  return allRecords.find(record => {
    const recordRaw = record.codigo.trim().toLowerCase();
    const recordNorm = normalizeCode(record.codigo);
    return recordRaw === rawClean || recordNorm === normalized;
  }) || null;
}

/**
 * Exibe mensagem de erro de validação em inglês
 */
function showError(message) {
  if (inputError) {
    inputError.textContent = message || 'Please enter the verification code.';
    inputError.classList.remove('hidden');
  }
  if (inputGroup) {
    inputGroup.classList.add('input-error');
  }
  if (input) {
    input.focus();
  }
}

/**
 * Remove indicação visual de erro
 */
function clearError() {
  if (inputError) {
    inputError.classList.add('hidden');
  }
  if (inputGroup) {
    inputGroup.classList.remove('input-error');
  }
}

/**
 * Alterna entre as telas da aplicação
 */
function showView(viewToShow) {
  [searchView, resultView, notFoundView].forEach(v => {
    if (v) v.classList.add('hidden');
  });
  if (viewToShow) {
    viewToShow.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/**
 * Renderiza os dados do documento na tela de resultado
 */
function renderResult(record, queryEntered) {
  if (valSituacao) valSituacao.textContent = record.situacao;
  if (valCodigo) valCodigo.textContent = record.codigo;
  if (valNome) valNome.textContent = record.nome;
  if (valSobrenome) valSobrenome.textContent = record.sobrenome;
  if (valRnm) valRnm.textContent = record.rnm;
  if (valNascimento) valNascimento.textContent = record.nascimento;
  if (valNacionalidade) valNacionalidade.textContent = record.nacionalidade;

  showView(resultView);
}

/**
 * Renderiza tela de código não localizado
 */
function renderNotFound(enteredCode) {
  if (valMissingCode) {
    valMissingCode.textContent = enteredCode.trim();
  }
  showView(notFoundView);
}

/**
 * Executa a verificação com modal de carregamento "Wait..."
 */
function verifyDocument(codeToVerify) {
  const code = (codeToVerify !== undefined ? codeToVerify : (input ? input.value : '')).trim();

  // Validação de campo vazio
  if (!code || normalizeCode(code).length === 0) {
    showError('Please enter the verification code.');
    return;
  }

  clearError();

  // Exibe modal "Aguarde..."
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }

  // Tempo de resposta realista (~600ms)
  setTimeout(() => {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }

    const match = findRecord(code);
    if (match) {
      renderResult(match, code);
      if (window.history && window.history.pushState) {
        const formattedCode = formatUuidMask(match.codigo);
        window.history.pushState({}, '', '/' + formattedCode);
      }
    } else {
      renderNotFound(code);
      if (window.history && window.history.pushState) {
        const formattedMissing = formatUuidMask(code) || code.trim();
        window.history.pushState({}, '', '/' + formattedMissing);
      }
    }
  }, 600);
}

/**
 * Detecta código verificador presente na URL (parâmetro, query, hash ou caminho)
 * Suporta:
 * - https://servicosdpfgovbr.vercel.app/1da662d388c046ec8d5579e1b5cf774f
 * - https://servicosdpfgovbr.vercel.app/1da662d3-88c0-46ec-8d55-79e1b5cf774f
 * - https://servicosdpfgovbr.vercel.app/?codigo=1da662d388c046ec8d5579e1b5cf774f
 * - https://servicosdpfgovbr.vercel.app/?1da662d388c046ec8d5579e1b5cf774f
 * - https://servicosdpfgovbr.vercel.app/#1da662d388c046ec8d5579e1b5cf774f
 */
function getCodeFromUrl() {
  try {
    // 1. Parâmetro de busca padrão (?codigo=... ou ?code=...)
    const params = new URLSearchParams(window.location.search);
    const paramCode = params.get('codigo') || params.get('code');
    if (paramCode && normalizeCode(paramCode).length === 32) {
      return paramCode.trim();
    }

    // 2. Query string direta sem chave (?1da662d388c046ec8d5579e1b5cf774f)
    const rawSearch = window.location.search.replace(/^\?/, '').trim();
    if (rawSearch && !rawSearch.includes('=') && normalizeCode(rawSearch).length === 32) {
      return rawSearch;
    }

    // 3. Hash da URL (#1da662d388c046ec8d5579e1b5cf774f)
    const rawHash = window.location.hash.replace(/^#/, '').trim();
    if (rawHash && normalizeCode(rawHash).length === 32) {
      return rawHash;
    }

    // 4. Caminho direto (/1da662d388c046ec8d5579e1b5cf774f)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    for (const part of pathParts) {
      if (normalizeCode(part).length === 32) {
        return part.trim();
      }
    }
  } catch (err) {
    console.warn('Erro ao processar código da URL:', err);
  }

  return null;
}

/**
 * Retorna para a tela de pesquisa
 */
function goBackToSearch() {
  showView(searchView);
  clearError();
  // Limpa o caminho da URL caso tenha sido acessado diretamente via link com código
  if (window.history && window.history.pushState) {
    window.history.pushState({}, '', '/');
  }
  if (input) {
    input.focus();
  }
}

/* ==========================================================================
   Ouvintes de Eventos
   ========================================================================== */

// Submissão do formulário
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    verifyDocument();
  });
}

// Sincronização do estado visual do campo de busca (Rótulo e Máscara)
function updateInputState() {
  if (!input || !inputGroup) return;
  const hasValue = input.value.trim().length > 0;
  if (hasValue) {
    inputGroup.classList.add('has-value');
  } else {
    inputGroup.classList.remove('has-value');
  }
}

// Aplicação de máscara em tempo real e controle de foco
if (input) {
  input.addEventListener('focus', () => {
    if (inputGroup) inputGroup.classList.add('is-focused');
    updateInputState();
  });

  input.addEventListener('blur', () => {
    if (inputGroup) inputGroup.classList.remove('is-focused');
    updateInputState();
  });

  input.addEventListener('input', (e) => {
    clearError();
    const formatted = formatUuidMask(input.value);
    input.value = formatted;
    updateInputState();
  });

  input.addEventListener('paste', (e) => {
    // Permite colar normalmente e formata no próximo frame
    setTimeout(() => {
      input.value = formatUuidMask(input.value);
      updateInputState();
    }, 0);
  });
}

// Botão Limpar
if (btnLimpar) {
  btnLimpar.addEventListener('click', () => {
    if (input) {
      input.value = '';
      updateInputState();
      input.focus();
    }
    clearError();
  });
}

// Botões Voltar
if (btnVoltar) {
  btnVoltar.addEventListener('click', goBackToSearch);
}

if (btnVoltarNotFound) {
  btnVoltarNotFound.addEventListener('click', goBackToSearch);
}

// Inicialização: Exibe a tela de pesquisa com o código já preenchido no campo de texto
window.addEventListener('DOMContentLoaded', () => {
  showView(searchView);
  const urlCode = getCodeFromUrl() || '1da662d388c046ec8d5579e1b5cf774f';
  if (input) {
    input.value = formatUuidMask(urlCode);
    updateInputState();
    if (document.activeElement === input) {
      input.blur();
    }
  }

  // Verifica se há parâmetro secreto na URL para abrir o gerenciador
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('manage') || params.has('owner') || params.get('secret') === '1234' || params.has('admin')) {
      openSecretModal();
    }
  } catch (e) {}
});

/* ==========================================================================
   Módulo Secreto de Administração do Proprietário (100% Oculto para Usuários)
   ========================================================================== */
const secretModal = document.getElementById('secret-admin-modal');
const secretBackdrop = document.getElementById('secret-admin-backdrop');
const secretClose = document.getElementById('secret-admin-close');
const secretAuthBox = document.getElementById('secret-auth-box');
const secretPinInput = document.getElementById('secret-pin-input');
const secretPinBtn = document.getElementById('secret-pin-btn');
const secretPinError = document.getElementById('secret-pin-error');
const secretManagerBox = document.getElementById('secret-manager-box');
const secretAlertSuccess = document.getElementById('secret-alert-success');
const secretAddForm = document.getElementById('secret-add-form');
const newDocCode = document.getElementById('new-doc-code');
const btnGenUuid = document.getElementById('btn-gen-uuid');
const newDocSituacao = document.getElementById('new-doc-situacao');
const newDocNome = document.getElementById('new-doc-nome');
const newDocSobrenome = document.getElementById('new-doc-sobrenome');
const newDocRnm = document.getElementById('new-doc-rnm');
const newDocNascimento = document.getElementById('new-doc-nascimento');
const newDocNacionalidade = document.getElementById('new-doc-nacionalidade');
const btnSaveSecretDoc = document.getElementById('btn-save-secret-doc');
const btnCancelSecretDoc = document.getElementById('btn-cancel-secret-doc');
const secretRecordsList = document.getElementById('secret-records-list');
const searchLogo = document.getElementById('search-logo');
const resultLogo = document.getElementById('result-logo');

let isSecretUnlocked = false;
const OWNER_SECRET_PIN = '1234';

/**
 * Abre a janela modal secreta
 */
function openSecretModal() {
  if (!secretModal) return;
  secretModal.classList.remove('hidden');

  if (isSecretUnlocked) {
    if (secretAuthBox) secretAuthBox.classList.add('hidden');
    if (secretManagerBox) secretManagerBox.classList.remove('hidden');
    renderSecretRecords();
  } else {
    if (secretAuthBox) secretAuthBox.classList.remove('hidden');
    if (secretManagerBox) secretManagerBox.classList.add('hidden');
    if (secretPinError) secretPinError.classList.add('hidden');
    if (secretPinInput) {
      secretPinInput.value = '';
      setTimeout(() => secretPinInput.focus(), 100);
    }
  }
}

/**
 * Fecha a janela modal secreta
 */
function closeSecretModal() {
  if (!secretModal) return;
  secretModal.classList.add('hidden');
  if (secretAlertSuccess) secretAlertSuccess.classList.add('hidden');
  if (secretPinError) secretPinError.classList.add('hidden');
}

/**
 * Desbloqueia o painel com o PIN de segurança
 */
function unlockSecretPanel() {
  if (!secretPinInput) return;
  const pin = secretPinInput.value.trim();
  if (pin === OWNER_SECRET_PIN) {
    isSecretUnlocked = true;
    if (secretAuthBox) secretAuthBox.classList.add('hidden');
    if (secretManagerBox) secretManagerBox.classList.remove('hidden');
    if (secretPinError) secretPinError.classList.add('hidden');
    renderSecretRecords();
  } else {
    if (secretPinError) secretPinError.classList.remove('hidden');
    secretPinInput.focus();
    secretPinInput.select();
  }
}

if (secretPinBtn) {
  secretPinBtn.addEventListener('click', unlockSecretPanel);
}

if (secretPinInput) {
  secretPinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      unlockSecretPanel();
    }
  });
}

if (secretClose) {
  secretClose.addEventListener('click', closeSecretModal);
}

if (secretBackdrop) {
  secretBackdrop.addEventListener('click', closeSecretModal);
}

if (btnCancelSecretDoc) {
  btnCancelSecretDoc.addEventListener('click', closeSecretModal);
}

/**
 * Gera um UUID v4 válido e único
 */
function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

if (btnGenUuid && newDocCode) {
  btnGenUuid.addEventListener('click', () => {
    newDocCode.value = generateUuid();
  });
}

/**
 * Renderiza a lista de registros salvos no modal secreto com link direto
 */
function renderSecretRecords() {
  if (!secretRecordsList) return;
  const allRecords = getAllRecords();
  
  if (allRecords.length === 0) {
    secretRecordsList.innerHTML = '<p style="color: #888; font-size: 12px;">No records found.</p>';
    return;
  }

  const origin = window.location.origin;

  let html = '';
  allRecords.forEach(record => {
    const isBuiltIn = (record.codigo === '1da662d388c046ec8d5579e1b5cf774f');
    const maskedCode = formatUuidMask(record.codigo);
    const fullShareLink = `${origin}/${maskedCode}`;
    const badgeHtml = isBuiltIn 
      ? '<span style="background: #e3f2fd; color: #1976d2; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Default</span>' 
      : '<span style="background: #e8f5e9; color: #2e7d32; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Custom</span>';

    html += `
      <div class="secret-record-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong style="font-family: monospace; font-size: 11.5px; color: #2b3a4a;">${maskedCode}</strong>
            ${badgeHtml}
          </div>
          <div style="font-size: 11.5px; color: #555;">
            <strong>${record.nome} ${record.sobrenome}</strong> &bull; RNM: ${record.rnm}
          </div>
        </div>

        <div style="width: 100%; background: #ffffff; border: 1px dashed #ced4da; border-radius: 4px; padding: 5px 8px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
          <span style="font-family: monospace; font-size: 11px; color: #2b70c9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
            ${fullShareLink}
          </span>
          <button type="button" class="btn-sm-outline" onclick="window.__copyDirectLink('${fullShareLink}', this)" style="color: #2b70c9; white-space: nowrap; padding: 2px 8px; font-size: 10.5px;">
            📋 Copy Link
          </button>
        </div>

        <div style="width: 100%; display: flex; justify-content: flex-end; gap: 6px;">
          <button type="button" class="btn-sm-outline" onclick="window.__verifyFromSecret('${record.codigo}')" style="color: #2e7d32; font-weight: 700;">
            🔍 Verify in Portal
          </button>
          ${!isBuiltIn ? `<button type="button" class="btn-sm-outline" onclick="window.__deleteFromSecret('${record.codigo}')" style="color: #c92a2a;">Delete</button>` : ''}
        </div>
      </div>
    `;
  });

  secretRecordsList.innerHTML = html;
}

// Copia o link gerado diretamente para a área de transferência
window.__copyDirectLink = function(url, btnElement) {
  const textToCopy = url || window.location.href;
  const updateBtn = () => {
    if (btnElement) {
      const orig = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Copied!';
      setTimeout(() => { btnElement.innerHTML = orig; }, 2000);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(updateBtn).catch(() => {
      fallbackCopy(textToCopy, btnElement);
    });
  } else {
    fallbackCopy(textToCopy, btnElement);
  }
};

function fallbackCopy(text, btnElement) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  try {
    document.execCommand('copy');
    if (btnElement) {
      const orig = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Copied!';
      setTimeout(() => { btnElement.innerHTML = orig; }, 2000);
    }
  } catch (e) {}
  document.body.removeChild(tempInput);
}

// Funções globais seguras de verificação e deleção direta do modal
window.__verifyFromSecret = function(code) {
  closeSecretModal();
  const formatted = formatUuidMask(code);
  if (input) {
    input.value = formatted;
    updateInputState();
  }
  verifyDocument(formatted);
};

window.__deleteFromSecret = function(code) {
  if (!confirm(`Are you sure you want to delete record ${code}?`)) return;
  try {
    const saved = localStorage.getItem('VERIFICATION_RECORDS_CUSTOM');
    if (saved) {
      let custom = JSON.parse(saved);
      if (Array.isArray(custom)) {
        custom = custom.filter(r => normalizeCode(r.codigo) !== normalizeCode(code));
        localStorage.setItem('VERIFICATION_RECORDS_CUSTOM', JSON.stringify(custom));
      }
    }
  } catch (err) {
    console.error('Error deleting record:', err);
  }
  renderSecretRecords();
};

/**
 * Salva novo documento adicionado pelo proprietário
 */
if (secretAddForm) {
  secretAddForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawCode = newDocCode ? newDocCode.value.trim() : '';
    const situacao = newDocSituacao ? newDocSituacao.value.trim() : 'Valid until: April 18, 2028';
    const nome = newDocNome ? newDocNome.value.trim() : '';
    const sobrenome = newDocSobrenome ? newDocSobrenome.value.trim() : '';
    const rnm = newDocRnm ? newDocRnm.value.trim() : '';
    const nascimento = newDocNascimento ? newDocNascimento.value.trim() : '';
    const nacionalidade = newDocNacionalidade ? newDocNacionalidade.value.trim() : '';

    if (!rawCode || !nome || !sobrenome || !rnm) {
      alert('Please fill in at least Code, Given Name, Surname, and RNM.');
      return;
    }

    const cleanCode = normalizeCode(rawCode);
    const newRecord = {
      codigo: cleanCode,
      situacao: situacao || 'Valid until: April 18, 2028',
      nome: nome,
      sobrenome: sobrenome,
      rnm: rnm,
      nascimento: nascimento || '01/01/2000',
      nacionalidade: nacionalidade || 'Afghanistan'
    };

    try {
      let custom = [];
      const saved = localStorage.getItem('VERIFICATION_RECORDS_CUSTOM');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) custom = parsed;
      }

      // Atualiza se já existir ou adiciona novo
      custom = custom.filter(r => normalizeCode(r.codigo) !== cleanCode);
      custom.push(newRecord);
      localStorage.setItem('VERIFICATION_RECORDS_CUSTOM', JSON.stringify(custom));

      const maskedClean = formatUuidMask(cleanCode);
      const shareUrl = `${window.location.origin}/${maskedClean}`;

      if (secretAlertSuccess) {
        secretAlertSuccess.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 3px;">✓ Document Saved Successfully!</div>
          <div style="font-size: 11px; margin-bottom: 6px; word-break: break-all; font-family: monospace; color: #155724;">${shareUrl}</div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button type="button" class="btn-sm-outline" onclick="window.__copyDirectLink('${shareUrl}', this)" style="color: #2b70c9;">📋 Copy Link</button>
            <button type="button" class="btn-sm-outline" onclick="window.__verifyFromSecret('${cleanCode}')" style="color: #2e7d32; font-weight: 700;">🔍 Verify in Portal</button>
          </div>
        `;
        secretAlertSuccess.classList.remove('hidden');
      }

      // Limpa os campos do formulário para nova inserção
      if (newDocCode) newDocCode.value = '';
      if (newDocNome) newDocNome.value = '';
      if (newDocSobrenome) newDocSobrenome.value = '';
      if (newDocRnm) newDocRnm.value = '';
      if (newDocNascimento) newDocNascimento.value = '';
      if (newDocNacionalidade) newDocNacionalidade.value = '';

      renderSecretRecords();
    } catch (err) {
      alert('Error saving record: ' + err.message);
    }
  });
}

/**
 * Gatilho Secreto 1: 5 Cliques Rápidos no Emblema da Polícia Federal
 */
let logoClicks = 0;
let logoClickTimer = null;

function setupLogoSecretTrigger(logoElement) {
  if (!logoElement) return;
  logoElement.addEventListener('click', () => {
    logoClicks++;
    if (logoClickTimer) clearTimeout(logoClickTimer);

    if (logoClicks >= 5) {
      logoClicks = 0;
      openSecretModal();
    } else {
      logoClickTimer = setTimeout(() => {
        logoClicks = 0;
      }, 2500);
    }
  });
}

setupLogoSecretTrigger(searchLogo);
setupLogoSecretTrigger(resultLogo);

/**
 * Gatilho Secreto 2: Atalho de Teclado (Ctrl + Shift + A ou Ctrl + Shift + V)
 */
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'V' || e.key === 'v')) {
    e.preventDefault();
    openSecretModal();
  }
  if (e.key === 'Escape') {
    closeSecretModal();
  }
});

