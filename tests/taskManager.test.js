import { describe, it, expect, beforeEach } from "vitest";
import { validateTitle, createTask, resetId } from "../src/taskManager.js";
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
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});
