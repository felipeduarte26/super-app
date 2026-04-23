export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestConfig {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  timeout?: number;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  ok: boolean;
}

export interface HttpClientInterceptor {
  onRequest?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
  onResponse?: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
  onError?: (error: HttpError) => void;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface IHttpClient {
  get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
  post<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
  put<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
  patch<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
  addInterceptor(interceptor: HttpClientInterceptor): void;
  setBaseUrl(url: string): void;
  setDefaultHeaders(headers: Record<string, string>): void;
}
