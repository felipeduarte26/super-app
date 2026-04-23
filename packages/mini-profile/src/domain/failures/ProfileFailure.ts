/**
 * Represents a failure during Profile/User operations.
 *
 */
export abstract class ProfileFailure {
  abstract readonly code: string;
  constructor(readonly message: string = '') {}
}

export class ProfileUnexpectedFailure extends ProfileFailure {
  readonly code = 'PROFILE_UNEXPECTED';
  constructor(message = 'Ocorreu um erro inesperado.') {
    super(message);
  }
}

export class ProfileServerFailure extends ProfileFailure {
  readonly code = 'PROFILE_SERVER';
  constructor(message = 'Erro no servidor ao carregar perfil.') {
    super(message);
  }
}

export class ProfileTimeoutFailure extends ProfileFailure {
  readonly code = 'PROFILE_TIMEOUT';
  constructor(message = 'A requisição demorou demais.') {
    super(message);
  }
}

export class ProfileNotFoundFailure extends ProfileFailure {
  readonly code = 'PROFILE_NOT_FOUND';
  constructor(message = 'Perfil não encontrado.') {
    super(message);
  }
}

export class ProfileValidationFailure extends ProfileFailure {
  readonly code = 'PROFILE_VALIDATION';
  constructor(
    message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}
