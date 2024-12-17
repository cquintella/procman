import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { LoggerInterface } from './logger_interface';

export class Logger implements LoggerInterface {
  private logger: WinstonLogger;

  constructor(logDirectory: string) {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.File({
          filename: `${logDirectory}/error.log`,
          level: 'error',
        }),
        new transports.File({ filename: `${logDirectory}/combined.log` }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }
  }

  public log(message: string): void {
    this.logInfo(message);
  }

  public logError(message: string): void {
    this.logger.log({ level: 'error', message });
  }

  public logWarn(message: string): void {
    this.logger.log({ level: 'warn', message });
  }

  public logInfo(message: string): void {
    this.logger.log({ level: 'info', message });
  }

  public logHttp(message: string): void {
    this.logger.log({ level: 'http', message });
  }

  public logVerbose(message: string): void {
    this.logger.log({ level: 'verbose', message });
  }

  public logDebug(message: string): void {
    this.logger.log({ level: 'debug', message });
  }

  public logSilly(message: string): void {
    this.logger.log({ level: 'silly', message });
  }

  public finalize(): void {
    // Finaliza o Logger se necessário
    this.logger.end();
  }
}
