/**
 * Represents a failure during Home/Notification operations.
 *
 * Equivalent to Dart's `sealed class HomeFailure`.
 * Each subclass maps to a specific error scenario.
 */
export abstract class HomeFailure {
  abstract readonly code: string;
  constructor(readonly message: string = '') {}
}

export class HomeUnexpectedFailure extends HomeFailure {
  readonly code = 'HOME_UNEXPECTED';
  constructor(message = 'Ocorreu um erro inesperado.') {
    super(message);
  }
}

export class HomeServerFailure extends HomeFailure {
  readonly code = 'HOME_SERVER';
  constructor(message = 'Erro no servidor ao carregar notificações.') {
    super(message);
  }
}

export class HomeTimeoutFailure extends HomeFailure {
  readonly code = 'HOME_TIMEOUT';
  constructor(message = 'A requisição demorou demais.') {
    super(message);
  }
}

export class HomeEmptyFailure extends HomeFailure {
  readonly code = 'HOME_EMPTY';
  constructor(message = 'Nenhuma notificação encontrada.') {
    super(message);
  }
}
