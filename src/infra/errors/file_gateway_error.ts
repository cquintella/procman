/**
 * Classe base para erros do FileGateway.
 */
export class FileGatewayError extends Error {
  readonly type: string;

  constructor(type: string, message: string) {
    super(message);
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype); // Corrige o protótipo ao usar herança
  }
}

/**
 * Erro para indicar que o arquivo não foi encontrado.
 */
export class FileNotFoundError extends FileGatewayError {
  readonly filePath: string;

  constructor(filePath: string) {
    super('FileNotFound', `File not found: ${filePath}`);
    this.filePath = filePath;
  }
}

/**
 * Erro para falhas na leitura de arquivos.
 */
export class FileReadError extends FileGatewayError {
  readonly filePath: string;
  readonly originalError: Error;

  constructor(filePath: string, originalError: Error) {
    super('ReadError', `Failed to read the file: ${filePath}`);
    this.filePath = filePath;
    this.originalError = originalError;
  }
}

/**
 * Erro para falhas na gravação de arquivos.
 */
export class FileWriteError extends FileGatewayError {
  readonly filePath: string;
  readonly originalError: Error;

  constructor(filePath: string, originalError: Error) {
    super('WriteError', `Failed to write to the file: ${filePath}`);
    this.filePath = filePath;
    this.originalError = originalError;
  }
}

/**
 * Erro para operações bloqueadas devido à consolidação do journal.
 */
export class ConsolidationInProgressError extends FileGatewayError {
  constructor() {
    super('ConsolidationInProgress', 'Journal consolidation is in progress.');
  }
}

/**
 * Erro para registro não encontrado.
 */
export class RecordNotFoundError extends FileGatewayError {
  readonly recordId: string;

  constructor(recordId: string) {
    super('RecordNotFound', `Record with ID ${recordId} was not found.`);
    this.recordId = recordId;
  }
}

/**
 * Erro genérico para casos desconhecidos.
 */
export class UnknownFileGatewayError extends FileGatewayError {
  readonly originalError: Error;

  constructor(originalError: Error) {
    super('Unknown', `An unknown error occurred: ${originalError.message}`);
    this.originalError = originalError;
  }
}
