/**
 * Represents a failure during Settings operations.
 *
 * Equivalent to Dart's `sealed class SettingsFailure`.
 */
export abstract class SettingsFailure {
  abstract readonly code: string;
  constructor(readonly message: string = '') {}
}

export class SettingsUnexpectedFailure extends SettingsFailure {
  readonly code = 'SETTINGS_UNEXPECTED';
  constructor(message = 'Ocorreu um erro inesperado.') {
    super(message);
  }
}

export class SettingsServerFailure extends SettingsFailure {
  readonly code = 'SETTINGS_SERVER';
  constructor(message = 'Erro no servidor ao carregar configurações.') {
    super(message);
  }
}

export class SettingsTimeoutFailure extends SettingsFailure {
  readonly code = 'SETTINGS_TIMEOUT';
  constructor(message = 'A requisição demorou demais.') {
    super(message);
  }
}

export class SettingsValidationFailure extends SettingsFailure {
  readonly code = 'SETTINGS_VALIDATION';
  constructor(
    message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}
