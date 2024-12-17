// Logger.test.ts
import { Logger } from './logger';
import { createLogger, transports, Logger as WinstonLogger } from 'winston';

jest.mock('winston', () => {
  const mLogger = {
    log: jest.fn(),
    add: jest.fn(),
    end: jest.fn(),
  };
  return {
    createLogger: jest.fn(() => mLogger),
    transports: {
      File: jest.fn(),
      Console: jest.fn(),
    },
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      errors: jest.fn(),
      splat: jest.fn(),
      json: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn(),
    },
  };
});

describe('Logger', () => {
  let logger: Logger;
  let mockLogger: jest.Mocked<WinstonLogger>;

  beforeEach(() => {
    mockLogger = createLogger() as jest.Mocked<WinstonLogger>;
    logger = new Logger('/test/logs');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log info message', () => {
    const message = 'Info message';
    logger.log(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'info', message });
  });

  it('should log error message', () => {
    const message = 'Error message';
    logger.logError(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'error', message });
  });

  it('should log warning message', () => {
    const message = 'Warning message';
    logger.logWarn(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'warn', message });
  });

  it('should log HTTP message', () => {
    const message = 'HTTP message';
    logger.logHttp(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'http', message });
  });

  it('should log verbose message', () => {
    const message = 'Verbose message';
    logger.logVerbose(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'verbose', message });
  });

  it('should log debug message', () => {
    const message = 'Debug message';
    logger.logDebug(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'debug', message });
  });

  it('should log silly message', () => {
    const message = 'Silly message';
    logger.logSilly(message);
    expect(mockLogger.log).toHaveBeenCalledWith({ level: 'silly', message });
  });

  it('should finalize the logger', () => {
    logger.finalize();
    expect(mockLogger.end).toHaveBeenCalled();
  });
});
