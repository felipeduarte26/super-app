import {Result, Success, Failure} from '../result/Result';

/**
 * A function that converts an unknown error into a failure of type F.
 *
 * Equivalent to Dart's `HandleExceptionType<F>`.
 */
export type HandleExceptionFn<F> = (error: unknown) => F;

/**
 * Base class for repositories that centralizes try/catch + error mapping.
 *
 * Equivalent to Dart's `BaseRepository<F extends Object>`.
 *
 * Each concrete repository:
 * 1. Extends `BaseRepository<MyFeatureFailure>`
 * 2. Implements `handleException` to map errors → feature-specific failures
 * 3. Uses `this.execute(...)` for every operation
 *
 * ```ts
 * class UserRepositoryImpl extends BaseRepository<ProfileFailure> {
 *   protected handleException: HandleExceptionFn<ProfileFailure> = (error) => {
 *     if (error instanceof HttpError && error.status === 404)
 *       return new ProfileNotFoundFailure();
 *     return new ProfileUnexpectedFailure(String(error));
 *   };
 *
 *   async getUser(): Promise<Result<User, ProfileFailure>> {
 *     return this.execute(
 *       () => this.apiClient.fetchUser(),
 *       (model) => model,
 *     );
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<F> {
  /**
   * Maps unknown errors to the feature-specific failure type F.
   * Must be implemented by every concrete repository.
   */
  protected abstract handleException: HandleExceptionFn<F>;

  /**
   * Executes an async action, transforms the result, and catches errors.
   *
   * Equivalent to Dart's `execute<T, R>({ onAction, onResponse })`.
   *
   * @param onAction  - Async function that fetches raw data (e.g., datasource call)
   * @param onResponse - Transforms the raw result into the desired type
   * @returns Result<R, F> — Success with transformed data or Failure with mapped error
   */
  protected async execute<T, R>(
    onAction: () => Promise<T>,
    onResponse: (result: T) => R,
  ): Promise<Result<R, F>> {
    try {
      const raw = await onAction();
      return new Success(onResponse(raw));
    } catch (error) {
      return new Failure(this.handleException(error));
    }
  }
}
