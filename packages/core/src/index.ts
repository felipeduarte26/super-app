export {EventBus} from './event-bus/EventBus';
export {AppEvents} from './event-bus/events';
export type {AppEvent, EventPayloadMap} from './event-bus/events';
export {useOn, useHandle} from './event-bus/useEventBus';

export {colors} from './theme';

export {Card} from './components/Card';
export {Badge} from './components/Badge';
export {Section} from './components/Section';

export type {
  MiniAppManifest,
  RouteDefinition,
  TabConfig,
} from './navigation/types';

export {FetchHttpClient, HttpClientFactory, HttpError} from './http';
export type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpClientInterceptor,
  HttpMethod,
} from './http';

export {
  Result,
  Success,
  Failure,
  success,
  failure,
  tryCatchAsync,
  NoParams,
  AppError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  ValidationError,
  UnexpectedError,
  mapHttpStatusToError,
  toAppError,
} from './result';
export type {AppErrorCode} from './result';

export {BaseRepository} from './data';
export type {HandleExceptionFn} from './data';

export {I18nStore, useTranslation, translations} from './i18n';
export type {AppLocale, TranslationKeys} from './i18n';
