import AppController from './infra/controllers/app_controller';

jest.mock('./controllers/AppController', () => {
  return {
    getInstance: jest.fn(() => ({
      startApp: jest.fn(),
      finalize: jest.fn(),
    })),
  };
});

describe('App Initialization', () => {
  let appController: AppController;
  let originalProcessExit: (code?: number) => never;

  beforeAll(() => {
    // Salva a referência original de process.exit
    originalProcessExit = process.exit;
    // Mocka process.exit
    process.exit = jest.fn() as unknown as (code?: number) => never;
  });

  afterAll(() => {
    // Restaura process.exit original
    process.exit = originalProcessExit;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    appController = AppController.getInstance();
  });

  it('should initialize and start the app', () => {
    // Importa o arquivo principal
    require('./index');

    // Verifica se os métodos foram chamados corretamente
    expect(AppController.getInstance).toHaveBeenCalled();
    expect(appController.startApp).toHaveBeenCalled();
  });

  it('should handle SIGINT signal and call finalize', () => {
    require('./index');

    // Emite o sinal SIGINT
    process.emit('SIGINT');

    // Verifica se o método finalize foi chamado
    expect(appController.finalize).toHaveBeenCalled();
    // Verifica se process.exit foi chamado
    expect(process.exit).toHaveBeenCalled();
  });
});
