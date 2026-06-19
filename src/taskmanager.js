// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================

let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}


// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

export function validateTitle(title) {
  if (typeof title !== "string") {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}

// ------------------------------------------------------------
// Criação
// ------------------------------------------------------------

export function createTask(title) {
  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
  };
}
