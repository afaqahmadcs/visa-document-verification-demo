/**
 * Authentic Document Verification
 * Exact match to user's reference screenshot
 */

'use strict';

/* ==========================================================================
   Document Registry Data Source
   Configured strictly with the specified client record
   ========================================================================== */
const VERIFICATION_RECORDS = [
  {
    codigo: '1da556d388c046ec8d3379e1b5cf772f',
    situation: 'Valid until: June 18, 2028',
    name: 'SHARIFULLAH',
    surname: 'HAMDARD',
    rnm: 'B269953J',
    dob: '29/02/2004',
    nationality: 'Afghanistan'
  }
];

/* ==========================================================================
   DOM Element Selectors
   ========================================================================== */
// Views
const searchView = document.getElementById('search-view');
const resultView = document.getElementById('result-view');
const notFoundView = document.getElementById('notfound-view');
const loadingOverlay = document.getElementById('loading-overlay');

// Form controls
const form = document.getElementById('verification-form');
const input = document.getElementById('codigo-input');
const inputGroup = input ? input.closest('.input-group') : null;
const inputError = document.getElementById('input-error');
const btnValidar = document.getElementById('btn-validar');
const btnLimpar = document.getElementById('btn-limpar');

// Result fields (exact match to screenshot)
const valSituation = document.getElementById('val-situation');
const valCode = document.getElementById('val-code');
const valName = document.getElementById('val-name');
const valSurname = document.getElementById('val-surname');
const valRnm = document.getElementById('val-rnm');
const valDob = document.getElementById('val-dob');
const valNationality = document.getElementById('val-nationality');

// Missing code field
const valMissingCode = document.getElementById('val-missing-code');

// Go back controls
const btnVoltar = document.getElementById('btn-voltar');
const btnVoltarNotFound = document.getElementById('btn-voltar-notfound');

/* ==========================================================================
   Helper & Normalization Functions
   ========================================================================== */

/**
 * Normalize code for comparison (trims spaces and handles hyphens)
 */
function normalizeCode(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Find matching document record in available dataset
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
 * Show validation error
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
 * Clear validation error
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
 * Switch active visible view
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
 * Render document details on result page
 */
function renderResult(record, queryEntered) {
  if (valSituation) valSituation.textContent = record.situation;
  if (valCode) valCode.textContent = record.codigo;
  if (valName) valName.textContent = record.name;
  if (valSurname) valSurname.textContent = record.surname;
  if (valRnm) valRnm.textContent = record.rnm;
  if (valDob) valDob.textContent = record.dob;
  if (valNationality) valNationality.textContent = record.nationality;

  showView(resultView);
}

/**
 * Render not found page
 */
function renderNotFound(enteredCode) {
  if (valMissingCode) {
    valMissingCode.textContent = enteredCode.trim();
  }
  showView(notFoundView);
}

/**
 * Execute verification with reference loading overlay
 */
function verifyDocument(codeToVerify) {
  const code = (codeToVerify !== undefined ? codeToVerify : (input ? input.value : '')).trim();

  // Validate empty input
  if (!code) {
    showError('Please enter the verification code.');
    return;
  }

  clearError();

  // Show loading modal "Aguarde..."
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }

  // Realistic processing duration (~650ms)
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
  }, 650);
}

/**
 * Reset to search page
 */
function goBackToSearch() {
  showView(searchView);
  clearError();
  if (input) {
    input.focus();
  }
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */

// Form submission
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    verifyDocument();
  });
}

// Input typing
if (input) {
  input.addEventListener('input', () => {
    clearError();
  });
}

// Limpar button
if (btnLimpar) {
  btnLimpar.addEventListener('click', () => {
    if (input) {
      input.value = '';
      input.focus();
    }
    clearError();
  });
}

// Go back buttons
if (btnVoltar) {
  btnVoltar.addEventListener('click', goBackToSearch);
}

if (btnVoltarNotFound) {
  btnVoltarNotFound.addEventListener('click', goBackToSearch);
}

// Check URL query parameters (e.g. ?codigo=... or ?code=...)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const codeParam = urlParams.get('codigo') || urlParams.get('code') || urlParams.get('ref');
  
  if (codeParam) {
    if (input) input.value = codeParam;
    verifyDocument(codeParam);
  } else if (input) {
    input.focus();
  }
});
