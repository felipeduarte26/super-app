export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNEXPECTED_ERROR';

export abstract class AppError {
  abstract readonly code: AppErrorCode;
  abstract readonly message: string;
  readonly timestamp: Date = new Date();
}

export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR' as const;
  constructor(
    readonly message: string = 'Sem conexão com a internet.',
    readonly originalError?: unknown,
  ) {
    super();
  }
}

export class TimeoutError extends AppError {
  readonly code = 'TIMEOUT_ERROR' as const;
  constructor(
    readonly message: string = 'A requisição demorou demais. Tente novamente.',
    readonly timeoutMs?: number,
  ) {
    super();
  }
}

export class UnauthorizedError extends AppError {
  readonly code = 'UNAUTHORIZED' as const;
  constructor(
    readonly message: string = 'Sessão expirada. Faça login novamente.',
  ) {
    super();
  }
}

export class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN' as const;
  constructor(
    readonly message: string = 'Você não tem permissão para esta ação.',
  ) {
    super();
  }
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND' as const;
  constructor(
    readonly message: string = 'Recurso não encontrado.',
    readonly resource?: string,
  ) {
    super();
  }
}

export class ServerError extends AppError {
  readonly code = 'SERVER_ERROR' as const;
  constructor(
    readonly message: string = 'Erro interno do servidor. Tente novamente mais tarde.',
    readonly statusCode?: number,
  ) {
    super();
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR' as const;
  constructor(
    readonly message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super();
  }
}

export class UnexpectedError extends AppError {
  readonly code = 'UNEXPECTED_ERROR' as const;
  constructor(
    readonly message: string = 'Ocorreu um erro inesperado.',
    readonly originalError?: unknown,
  ) {
    super();
  }
}

export function mapHttpStatusToError(
  status: number,
  url: string,
  data?: unknown,
): AppError {
  switch (true) {
    case status === 401:
      return new UnauthorizedError();
    case status === 403:
      return new ForbiddenError();
    case status === 404:
      return new NotFoundError(undefined, url);
    case status === 408:
      return new TimeoutError();
    case status >= 400 && status < 500:
      return new ValidationError(
        `Requisição inválida (${status}).`,
        typeof data === 'object' && data !== null ? (data as Record<string, string>) : {},
      );
    case status >= 500:
      return new ServerError(undefined, status);
    default:
      return new UnexpectedError(`HTTP ${status} em ${url}`);
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError && error.message === 'Network request failed') {
    return new NetworkError();
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return new TimeoutError();
    }
    return new UnexpectedError(error.message, error);
  }

  return new UnexpectedError(String(error), error);
}
