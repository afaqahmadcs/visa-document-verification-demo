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
    codigo: '1da556d388c046ec8d3379e1b5cf772f',
    situacao: 'Válido até: 18 de junho de 2028',
    nome: 'SHARIFULLAH',
    sobrenome: 'HAMDARD',
    rnm: 'B269953J',
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
 * Exibe mensagem de erro de validação em português
 */
function showError(message) {
  if (inputError) {
    inputError.textContent = message || 'Por favor, informe o código verificador.';
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
 * Executa a verificação com modal de carregamento "Aguarde..."
 */
function verifyDocument(codeToVerify) {
  const code = (codeToVerify !== undefined ? codeToVerify : (input ? input.value : '')).trim();

  // Validação de campo vazio
  if (!code || normalizeCode(code).length === 0) {
    showError('Por favor, informe o código verificador.');
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
    } else {
      renderNotFound(code);
    }
  }, 600);
}

/**
 * Retorna para a tela de pesquisa
 */
function goBackToSearch() {
  showView(searchView);
  clearError();
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

// Aplicação de máscara em tempo real
if (input) {
  input.addEventListener('input', (e) => {
    clearError();
    const formatted = formatUuidMask(input.value);
    input.value = formatted;
  });

  input.addEventListener('paste', (e) => {
    // Permite colar normalmente e formata no próximo frame
    setTimeout(() => {
      input.value = formatUuidMask(input.value);
    }, 0);
  });
}

// Botão Limpar
if (btnLimpar) {
  btnLimpar.addEventListener('click', () => {
    if (input) {
      input.value = '';
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

// Inicialização: O campo permanece vazio no carregamento
window.addEventListener('DOMContentLoaded', () => {
  if (input) {
    input.value = '';
    input.focus();
  }
});
