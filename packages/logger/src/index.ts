export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  correlationId?: string;
  data?: Record<string, unknown>;
}

export class Logger {
  constructor(private context: string = 'Application') {}

  info(dataOrMsg: Record<string, unknown> | string, msg?: string): void {
    if (typeof dataOrMsg === 'string') {
      this.log(LogLevel.INFO, dataOrMsg);
    } else {
      this.log(LogLevel.INFO, msg || '', dataOrMsg);
    }
  }

  warn(dataOrMsg: Record<string, unknown> | string, msg?: string): void {
    if (typeof dataOrMsg === 'string') {
      this.log(LogLevel.WARN, dataOrMsg);
    } else {
      this.log(LogLevel.WARN, msg || '', dataOrMsg);
    }
  }

  error(dataOrMsg: Record<string, unknown> | string, msg?: string): void {
    if (typeof dataOrMsg === 'string') {
      this.log(LogLevel.ERROR, dataOrMsg);
    } else {
      this.log(LogLevel.ERROR, msg || '', dataOrMsg);
    }
  }

  debug(dataOrMsg: Record<string, unknown> | string, msg?: string): void {
    if (typeof dataOrMsg === 'string') {
      this.log(LogLevel.DEBUG, dataOrMsg);
    } else {
      this.log(LogLevel.DEBUG, msg || '', dataOrMsg);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };
    console.log(JSON.stringify(entry));
  }
}

export const logger = new Logger('System');
