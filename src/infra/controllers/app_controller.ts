//src/infra/controllers/app_controller.ts

import HTTPController from './web_controler';
import fs from 'fs';
import { ConfigInterface } from '../gateways/config_interface';
import { Logger } from '../adapters/logger';

/**
 * Classe AppController
 *
 * A classe `AppController` é responsável pela inicialização, configuração e gerenciamento do ciclo de vida
 * principal da aplicação. Ela segue o padrão Singleton, garantindo que apenas uma instância de `AppController`
 * esteja ativa durante a execução do aplicativo.
 *
 * @class AppController
 */

export class AppController {
  private static instance: AppController;
  private config: ConfigInterface;
  private webController!: HTTPController;
  private logger: Logger;


  private constructor() {
    console.log('Starting Appcontroller.\n');
    let configFile = process.env.CONFIG_FILE || './config/config.json';
    this.config = this.loadConfig(configFile);

    this.logger = new Logger(this.config.logDir);
    this.logger.logInfo('Iniciando Logger');

    try {
      this.webController = new HTTPController(
        this.config.port,
        this.config.bindInt,
        this.logger,
        this.config.token
      );
      this.logger.logInfo('HTTPController Initiated.');
    } catch (error) {
      this.logger.logError(
        `Error Starting HTTPController: ${(error as Error).message}`
      );
      this.finalize(1); // Chama finalize para limpeza antes de encerrar
    }
  }

  /**  Getter estático para acessar a instância singleton
   *
   * @returns {AppController} class instance.
   * */
  public static getInstance(): AppController {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }

  /**
   *
   * @param configFile
   * @returns {ConfigInterface} Configuration data object.
   */
  private loadConfig(configFile: string): ConfigInterface {
    console.log('Loading Configuration from: '+configFile+'.\n');
    const data = fs.readFileSync(configFile, 'utf-8');
    return JSON.parse(data);
  }

  /**
   *
   */
  public startApp(): void {
    this.webController.serve();
  }

  // Método para finalizar a aplicação (se necessário)
  public finalize(code: number = 0): void {
    this.webController.finalize();
    this.logger.logInfo('Closing Application.');
    if (!code) process.exit(code);
  }
}
