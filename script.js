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
 * Localiza o registro correspondente no repositório
 */
function findRecord(searchQuery) {
  if (!searchQuery) return null;
  const rawClean = searchQuery.trim().toLowerCase();
  const normalized = normalizeCode(searchQuery);

  return VERIFICATION_RECORDS.find(record => {
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
        window.history.pushState({}, '', '/' + match.codigo);
      }
    } else {
      renderNotFound(code);
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
});
