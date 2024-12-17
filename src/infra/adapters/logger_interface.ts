// logger_interface.ts

export interface LoggerInterface {
  log(message: string): void;
  logError(message: string): void;
  logWarn(message: string): void;
  logInfo(message: string): void;
  logHttp(message: string): void;
  logVerbose(message: string): void;
  logDebug(message: string): void;
  logSilly(message: string): void;
  finalize(): void;
}
