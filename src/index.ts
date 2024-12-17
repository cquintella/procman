import  { AppController } from './infra/controllers/app_controller';

// Inicializa a aplicação utilizando o AppController singleton
console.log('Iniating...\n');
let appController: AppController = AppController.getInstance();
appController.startApp();

// Captura sinal de encerramento para finalizar a aplicação corretamente
process.on('SIGINT', () => {
  appController.finalize();
  process.exit();
});
