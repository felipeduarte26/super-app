/**
 * Represents the result of an operation that can either
 * be a success or a failure.
 *
 * Inspired by Dart's sealed class Result<E, T>.
 * Provides methods to check the result type, access the values,
 * and fold the result into a single output.
 */
export abstract class Result<T, E = Error> {
  abstract readonly ok: boolean;

  /** Returns true if this result is a Success. */
  isSuccess(): this is Success<T, E> {
    return this.ok;
  }

  /** Returns true if this result is a Failure. */
  isFailure(): this is Failure<T, E> {
    return !this.ok;
  }

  /**
   * Extracts the success value.
   * Throws if this is a Failure.
   */
  toSuccess(): T {
    if (this.isSuccess()) {
      return this.data;
    }
    throw new Error(
      `Tried to extract success from a Failure: ${String((this as unknown as Failure<T, E>).error)}`,
    );
  }

  /**
   * Extracts the error value.
   * Throws if this is a Success.
   */
  toFailure(): E {
    if (this.isFailure()) {
      return this.error;
    }
    throw new Error('Tried to extract error from a Success');
  }

  /** Returns the success data, or the fallback if this is a Failure. */
  getOrElse(fallback: T): T {
    return this.isSuccess() ? this.data : fallback;
  }

  /**
   * Applies a function based on whether this result is a success or failure.
   *
   * ```ts
   * result.fold(
   *   error => setError(error),
   *   data  => setUser(data),
   * );
   * ```
   */
  fold<R>(onFailure: (error: E) => R, onSuccess: (data: T) => R): R {
    if (this.isSuccess()) {
      return onSuccess(this.data);
    }
    return onFailure((this as unknown as Failure<T, E>).error);
  }

  /**
   * Transforms the success value, keeping Failure intact.
   *
   * ```ts
   * const viewModel = result.map(UserMapper.toViewModel);
   * ```
   */
  map<U>(fn: (data: T) => U): Result<U, E> {
    if (this.isSuccess()) {
      return success(fn(this.data));
    }
    return this as unknown as Result<U, E>;
  }

  /**
   * Chains operations that return Result (sync).
   *
   * ```ts
   * const result = repo.getAll().flatMap(items => {
   *   const sorted = sortByDate(items);
   *   return success(Mapper.toViewModelList(sorted));
   * });
   * ```
   */
  flatMap<U>(fn: (data: T) => Result<U, E>): Result<U, E> {
    if (this.isSuccess()) {
      return fn(this.data);
    }
    return this as unknown as Result<U, E>;
  }

  /**
   * Chains async operations that return Promise<Result> .
   *
   * ```ts
   * const result = await currentResult.flatMapAsync(async user => {
   *   const updated = await repo.updateUser(user);
   *   return updated.map(UserMapper.toViewModel);
   * });
   * ```
   */
  async flatMapAsync<U>(
    fn: (data: T) => Promise<Result<U, E>>,
  ): Promise<Result<U, E>> {
    if (this.isSuccess()) {
      return fn(this.data);
    }
    return this as unknown as Result<U, E>;
  }
}

/**
 * Represents a successful result containing a value.
 */
export class Success<T, E = Error> extends Result<T, E> {
  readonly ok = true as const;
  constructor(readonly data: T) {
    super();
  }
}

/**
 * Represents a failure result containing an error.
 */
export class Failure<T, E = Error> extends Result<T, E> {
  readonly ok = false as const;
  constructor(readonly error: E) {
    super();
  }
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function success<T>(data: T): Result<T, never> {
  return new Success(data);
}

export function failure<E>(error: E): Result<never, E> {
  return new Failure(error);
}

// ---------------------------------------------------------------------------
// Async helper (usado nos Repositories)
// ---------------------------------------------------------------------------

export async function tryCatchAsync<T, E>(
  fn: () => Promise<T>,
  onError: (error: unknown) => E,
): Promise<Result<T, E>> {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    return failure(onError(error));
  }
}

// ---------------------------------------------------------------------------
// NoParams (para Use Cases sem parâmetros)
// ---------------------------------------------------------------------------

export class NoParams {
  private static readonly _instance = new NoParams();
  private constructor() {}
  static create(): NoParams {
    return NoParams._instance;
  }
}
