import { describe, it, expect, beforeEach } from "vitest";
import {
  validateTitle,
  createTask,
  addTask,
  toggleTask,
  removeTask,
  filterTasks,
  countTasks,
  countCompleted,
  countPending,
  validatePriority,
  filterByPriority,
  isDuplicate,
  sortTasks,
  searchTasks,
  resetId,
} from "../src/taskManager.js";
// ============================================================
// 1. validateTitle
// ============================================================
describe("validateTitle", () => {
  it("deve retornar true para um título válido", () => {
    expect(validateTitle("Estudar Vitest")).toBe(true);
  });

  it("deve retornar true para título com exatamente 3 caracteres", () => {
    expect(validateTitle("abc")).toBe(true);
  });

  it("deve retornar false para string vazia", () => {
    expect(validateTitle("")).toBe(false);
  });

  it("deve retornar false para string com apenas espaços", () => {
    expect(validateTitle("   ")).toBe(false);
  });

  it("deve retornar false para título com menos de 3 caracteres", () => {
    expect(validateTitle("ab")).toBe(false);
  });

  it("deve retornar false para null", () => {
    expect(validateTitle(null)).toBe(false);
  });

  it("deve retornar false para undefined", () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it("deve retornar false para número", () => {
    expect(validateTitle(123)).toBe(false);
  });

  it("deve retornar false para booleano", () => {
    expect(validateTitle(true)).toBe(false);
  });

  it("deve retornar false para array", () => {
    expect(validateTitle(["tarefa"])).toBe(false);
  });

  it("deve considerar o título após trim", () => {
    expect(validateTitle("  abc  ")).toBe(true);
  });
});

// ============================================================
// 2. createTask
// ============================================================
describe("createTask", () => {
  beforeEach(() => {
    resetId();
  });

  it("deve criar uma tarefa com as propriedades corretas", () => {
    const task = createTask("Estudar TDD");

    expect(task).toHaveProperty("id");
    expect(task).toHaveProperty("title", "Estudar TDD");
    expect(task).toHaveProperty("completed", false);
  });

  it("deve atribuir IDs incrementais", () => {
    const task1 = createTask("Tarefa 1");
    const task2 = createTask("Tarefa 2");

    expect(task2.id).toBe(task1.id + 1);
  });

  it("deve iniciar com completed = false", () => {
    const task = createTask("Nova tarefa");

    expect(task.completed).toBe(false);
  });

  it("deve fazer trim do título", () => {
    const task = createTask("  Título com espaços  ");

    expect(task.title).toBe("Título com espaços");
  });
});

// ============================================================
// 3. addTask
// ============================================================
describe("addTask", () => {
  beforeEach(() => {
    resetId();
  });

  it("deve adicionar uma tarefa a uma lista vazia", () => {
    const tasks = addTask([], "Primeira tarefa");

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Primeira tarefa");
  });

  it("deve adicionar uma tarefa a uma lista existente", () => {
    let tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe("Tarefa 2");
  });

  it("deve retornar um NOVO array (imutabilidade)", () => {
    const original = [];
    const updated = addTask(original, "Nova tarefa");

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it("deve lançar erro para título vazio", () => {
    expect(() => addTask([], "")).toThrow("Título inválido");
  });

  it("deve lançar erro para título null", () => {
    expect(() => addTask([], null)).toThrow("Título inválido");
  });

  it("deve lançar erro para título undefined", () => {
    expect(() => addTask([], undefined)).toThrow("Título inválido");
  });

  it("deve lançar erro para título com menos de 3 caracteres", () => {
    expect(() => addTask([], "ab")).toThrow("Título inválido");
  });

  it("deve lançar erro para título numérico", () => {
    expect(() => addTask([], 42)).toThrow("Título inválido");
  });
});

// ============================================================
// 4. toggleTask
// ============================================================
describe("toggleTask", () => {
  beforeEach(() => {
    resetId();
  });

  it("deve marcar uma tarefa pendente como concluída", () => {
    const task = createTask("Tarefa pendente");
    const toggled = toggleTask(task);

    expect(toggled.completed).toBe(true);
  });

  it("deve desmarcar uma tarefa concluída", () => {
    const task = createTask("Tarefa pendente");
    const completed = toggleTask(task);
    const uncompleted = toggleTask(completed);

    expect(uncompleted.completed).toBe(false);
  });

  it("deve manter o id e o título inalterados", () => {
    const task = createTask("Minha tarefa");
    const toggled = toggleTask(task);

    expect(toggled.id).toBe(task.id);
    expect(toggled.title).toBe(task.title);
  });

  it("deve retornar um NOVO objeto (imutabilidade)", () => {
    const task = createTask("Tarefa original");
    const toggled = toggleTask(task);

    expect(toggled).not.toBe(task);
    expect(task.completed).toBe(false); // original inalterado
  });
});

// ============================================================
// 5. removeTask
// ============================================================
describe("removeTask", () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");
    tasks = addTask(tasks, "Tarefa 3");
  });

  it("deve remover uma tarefa pelo ID", () => {
    const updated = removeTask(tasks, 2);

    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === 2)).toBeUndefined();
  });

  it("deve manter as outras tarefas intactas", () => {
    const updated = removeTask(tasks, 2);

    expect(updated[0].title).toBe("Tarefa 1");
    expect(updated[1].title).toBe("Tarefa 3");
  });

  it("deve retornar um NOVO array (imutabilidade)", () => {
    const updated = removeTask(tasks, 1);

    expect(updated).not.toBe(tasks);
    expect(tasks).toHaveLength(3); // original inalterado
  });

  it("deve retornar a lista completa se o ID não existir", () => {
    const updated = removeTask(tasks, 999);

    expect(updated).toHaveLength(3);
  });

  it("deve retornar array vazio ao remover de lista vazia", () => {
    const updated = removeTask([], 1);

    expect(updated).toHaveLength(0);
  });
});

// ============================================================
// 6. filterTasks
// ============================================================
describe("filterTasks", () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");
    tasks = addTask(tasks, "Tarefa 3");
    // Marca a segunda tarefa como concluída
    tasks = tasks.map((t) => (t.id === 2 ? toggleTask(t) : t));
  });

  it('deve retornar todas as tarefas com filtro "all"', () => {
    const result = filterTasks(tasks, "all");

    expect(result).toHaveLength(3);
  });

  it('deve retornar apenas pendentes com filtro "pending"', () => {
    const result = filterTasks(tasks, "pending");

    expect(result).toHaveLength(2);
    result.forEach((t) => expect(t.completed).toBe(false));
  });

  it('deve retornar apenas concluídas com filtro "completed"', () => {
    const result = filterTasks(tasks, "completed");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Tarefa 2");
    expect(result[0].completed).toBe(true);
  });

  it("deve retornar todas as tarefas para filtro desconhecido (default)", () => {
    const result = filterTasks(tasks, "invalido");

    expect(result).toHaveLength(3);
  });

  it("deve retornar array vazio para lista vazia", () => {
    expect(filterTasks([], "all")).toHaveLength(0);
    expect(filterTasks([], "pending")).toHaveLength(0);
    expect(filterTasks([], "completed")).toHaveLength(0);
  });

  it("deve retornar um NOVO array (imutabilidade)", () => {
    const result = filterTasks(tasks, "all");

    expect(result).not.toBe(tasks);
  });
});

// ============================================================
// 7. Contagens
// ============================================================
describe("countTasks", () => {
  it("deve retornar 0 para lista vazia", () => {
    expect(countTasks([])).toBe(0);
  });

  it("deve retornar o total de tarefas", () => {
    resetId();
    let tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");
    tasks = addTask(tasks, "Tarefa 3");

    expect(countTasks(tasks)).toBe(3);
  });
});

describe("countCompleted", () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");
    tasks = addTask(tasks, "Tarefa 3");
    tasks = tasks.map((t) => (t.id <= 2 ? toggleTask(t) : t));
  });

  it("deve retornar 0 para lista vazia", () => {
    expect(countCompleted([])).toBe(0);
  });

  it("deve contar corretamente as tarefas concluídas", () => {
    expect(countCompleted(tasks)).toBe(2);
  });

  it("deve retornar 0 quando nenhuma tarefa está concluída", () => {
    resetId();
    let noCompleted = addTask([], "Tarefa A");
    noCompleted = addTask(noCompleted, "Tarefa B");

    expect(countCompleted(noCompleted)).toBe(0);
  });
});

describe("countPending", () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], "Tarefa 1");
    tasks = addTask(tasks, "Tarefa 2");
    tasks = addTask(tasks, "Tarefa 3");
    tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
  });

  it("deve retornar 0 para lista vazia", () => {
    expect(countPending([])).toBe(0);
  });

  it("deve contar corretamente as tarefas pendentes", () => {
    expect(countPending(tasks)).toBe(2);
  });

  it("deve retornar 0 quando todas as tarefas estão concluídas", () => {
    const allCompleted = tasks.map((t) => ({ ...t, completed: true }));

    expect(countPending(allCompleted)).toBe(0);
  });
});

// ============================================================
// 8. Prioridade de Tarefas
// ============================================================

describe("validatePriority", () => {
  it("deve retornar true para prioridades válidas", () => {
    expect(validatePriority("low")).toBe(true);
    expect(validatePriority("medium")).toBe(true);
    expect(validatePriority("high")).toBe(true);
  });

  it("deve retornar false para prioridades inválidas", () => {
    expect(validatePriority("urgente")).toBe(false);
    expect(validatePriority("baixa")).toBe(false);
    expect(validatePriority("")).toBe(false);
    expect(validatePriority(null)).toBe(false);
  });
});

describe("createTask (prioridade)", () => {
  beforeEach(() => {
    resetId();
  });

  it("deve atribuir a prioridade informada", () => {
    const task = createTask("Tarefa Importante", "high");
    expect(task.priority).toBe("high");
  });

  it('deve atribuir prioridade "medium" por padrão', () => {
    const task = createTask("Tarefa Normal");
    expect(task.priority).toBe("medium");
  });
});

describe("filterByPriority", () => {
  let tasks;

  beforeEach(() => {
    resetId();
    // Criamos tarefas diretamente para testar o filtro
    tasks = [
      createTask("Tarefa 1", "low"),
      createTask("Tarefa 2", "high"),
      createTask("Tarefa 3", "medium"),
      createTask("Tarefa 4", "high"),
    ];
  });

  it("deve retornar apenas as tarefas da prioridade solicitada", () => {
    const highPriorityTasks = filterByPriority(tasks, "high");

    expect(highPriorityTasks).toHaveLength(2);
    expect(highPriorityTasks[0].title).toBe("Tarefa 2");
    expect(highPriorityTasks[1].title).toBe("Tarefa 4");
  });

  it("deve retornar array vazio se não houver tarefas com a prioridade", () => {
    // Usando uma prioridade que não existe na nossa lista atual
    const urgenteTasks = filterByPriority(tasks, "urgente");
    expect(urgenteTasks).toHaveLength(0);
  });
});

// ============================================================
// 9. Tarefas Duplicadas
// ============================================================

describe('isDuplicate', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = [createTask('Estudar Node')];
  });

  it('deve retornar true se a tarefa já existe (título exato)', () => {
    expect(isDuplicate(tasks, 'Estudar Node')).toBe(true);
  });

  it('deve retornar true ignorando maiúsculas/minúsculas e espaços', () => {
    expect(isDuplicate(tasks, '  estudar node  ')).toBe(true);
  });

  it('deve retornar false se a tarefa não existe', () => {
    expect(isDuplicate(tasks, 'Estudar React')).toBe(false);
  });
});

describe('addTask (duplicatas)', () => {
  it('deve lançar erro ao tentar adicionar tarefa com título duplicado', () => {
    resetId();
    const tasks = [createTask('Estudar')];
    
    expect(() => addTask(tasks, 'estudar')).toThrow('Tarefa já existe');
  });
});

// ============================================================
// 10. Ordenar Tarefas
// ============================================================

describe('sortTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = [
      createTask('Tarefa 1'), // Pendente (ID 1)
      createTask('Tarefa 2'), // Pendente (ID 2)
      createTask('Tarefa 3'), // Pendente (ID 3)
    ];
    
    // Vamos marcar a Tarefa 1 e a Tarefa 3 como concluídas
    // A lista original ficará: [Concluída, Pendente, Concluída]
    tasks[0] = toggleTask(tasks[0]);
    tasks[2] = toggleTask(tasks[2]);
  });

  it('deve retornar pendentes primeiro, depois concluídas', () => {
    const sorted = sortTasks(tasks);
    
    expect(sorted).toHaveLength(3);
    expect(sorted[0].id).toBe(2); // A pendente deve subir para a primeira posição
    expect(sorted[1].id).toBe(1); // As concluídas vêm depois, na ordem original
    expect(sorted[2].id).toBe(3); 
  });

  it('deve manter a ordem se todas forem pendentes', () => {
    const pendingTasks = [createTask('A'), createTask('B')];
    const sorted = sortTasks(pendingTasks);
    
    expect(sorted[0].title).toBe('A');
    expect(sorted[1].title).toBe('B');
  });

  it('deve manter a ordem se todas forem concluídas', () => {
    const completedTasks = [
      toggleTask(createTask('A')),
      toggleTask(createTask('B'))
    ];
    const sorted = sortTasks(completedTasks);
    
    expect(sorted[0].title).toBe('A');
    expect(sorted[1].title).toBe('B');
  });

  it('deve retornar array vazio para lista vazia', () => {
    expect(sortTasks([])).toHaveLength(0);
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const sorted = sortTasks(tasks);
    expect(sorted).not.toBe(tasks);
  });
});

// ============================================================
// 11. Busca por Texto
// ============================================================

describe('searchTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = [
      createTask('Estudar Node.js'),
      createTask('Testar a aplicação'),
      createTask('Comprar pão')
    ];
  });

  it('deve encontrar tarefas que contenham a query', () => {
    // "est" tem em "Estudar" e "Testar"
    const results = searchTasks(tasks, 'est');
    
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Estudar Node.js');
    expect(results[1].title).toBe('Testar a aplicação');
  });

  it('deve ser case-insensitive (ignorar maiúsculas/minúsculas)', () => {
    const results = searchTasks(tasks, 'NODE');
    
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Estudar Node.js');
  });

  it('deve retornar array vazio se nenhuma tarefa corresponder', () => {
    const results = searchTasks(tasks, 'xyz');
    expect(results).toHaveLength(0);
  });

  it('deve retornar array vazio se a lista de tarefas estiver vazia', () => {
    expect(searchTasks([], 'algo')).toHaveLength(0);
  });

  it('deve retornar todas as tarefas se a query for uma string vazia', () => {
    const results = searchTasks(tasks, '');
    expect(results).toHaveLength(3);
  });
});