import { Process } from './process';

describe('Process', () => {
  it('deve criar um processo com sucesso quando os valores são válidos', () => {
    const process = Process.create(
      'Processo Teste',
      'Objetivo Teste',
      'Descrição Teste'
    );

    expect(process).toBeInstanceOf(Process);
    expect(process.name).toBe('Processo Teste');
    expect(process.objective).toBe('Objetivo Teste');
    expect(process.description).toBe('Descrição Teste');
  });

  it('deve lançar um erro ao criar um processo com nome vazio', () => {
    expect(() => {
      Process.create('', 'Objetivo Teste', 'Descrição Teste');
    }).toThrow('Process name is required');
  });

  it('deve lançar um erro ao tentar definir o nome como vazio', () => {
    const process = Process.create(
      'Processo Teste',
      'Objetivo Teste',
      'Descrição Teste'
    );

    expect(() => {
      process.name = '';
    }).toThrow('Process name cannot be empty');
  });

  it('deve lançar um erro ao tentar definir o objetivo como vazio', () => {
    const process = Process.create(
      'Processo Teste',
      'Objetivo Teste',
      'Descrição Teste'
    );

    expect(() => {
      process.objective = '';
    }).toThrow('Process objective cannot be empty');
  });

  it('deve atualizar a descrição com sucesso', () => {
    const process = Process.create(
      'Processo Teste',
      'Objetivo Teste',
      'Descrição Teste'
    );

    process.description = 'Nova descrição';
    expect(process.description).toBe('Nova descrição');
  });

  it('deve gerar IDs únicos para cada processo criado', () => {
    const process1 = Process.create('Processo 1', 'Objetivo 1', 'Descrição 1');
    const process2 = Process.create('Processo 2', 'Objetivo 2', 'Descrição 2');

    expect(process1.id).not.toBe(process2.id);
  });
});
