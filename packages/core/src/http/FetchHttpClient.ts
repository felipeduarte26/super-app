import type {
  HttpClientInterceptor,
  HttpRequestConfig,
  HttpResponse,
  IHttpClient,
} from './types';
import {HttpError} from './types';

function buildUrl(base: string, path: string, params?: Record<string, string>): string {
  const url = path.startsWith('http') ? path : `${base}${path}`;
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  const qs = new URLSearchParams(params).toString();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${qs}`;
}

export class FetchHttpClient implements IHttpClient {
  private baseUrl = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  private interceptors: HttpClientInterceptor[] = [];

  setBaseUrl(url: string): void {
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {...this.defaultHeaders, ...headers};
  }

  addInterceptor(interceptor: HttpClientInterceptor): void {
    this.interceptors.push(interceptor);
  }

  async get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
    return this.request<T>({...config, url, method: 'GET'});
  }

  async post<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
    return this.request<T>({...config, url, method: 'POST', body});
  }

  async put<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
    return this.request<T>({...config, url, method: 'PUT', body});
  }

  async patch<T>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
    return this.request<T>({...config, url, method: 'PATCH', body});
  }

  async delete<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
    return this.request<T>({...config, url, method: 'DELETE'});
  }

  private async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    let resolvedConfig = this.applyDefaults(config);

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        resolvedConfig = await interceptor.onRequest(resolvedConfig);
      }
    }

    const fullUrl = buildUrl(this.baseUrl, resolvedConfig.url, resolvedConfig.params);

    const fetchOptions: RequestInit = {
      method: resolvedConfig.method ?? 'GET',
      headers: resolvedConfig.headers,
    };

    if (resolvedConfig.body !== undefined && resolvedConfig.method !== 'GET') {
      fetchOptions.body = JSON.stringify(resolvedConfig.body);
    }

    let fetchPromise: Promise<Response> = fetch(fullUrl, fetchOptions);

    if (resolvedConfig.timeout) {
      fetchPromise = this.withTimeout(fetchPromise, resolvedConfig.timeout);
    }

    const rawResponse = await fetchPromise;

    const responseHeaders: Record<string, string> = {};
    rawResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const contentType = responseHeaders['content-type'] ?? '';
    let data: T;
    if (contentType.includes('application/json')) {
      data = (await rawResponse.json()) as T;
    } else {
      data = (await rawResponse.text()) as unknown as T;
    }

    if (!rawResponse.ok) {
      const error = new HttpError(
        `HTTP ${rawResponse.status}: ${rawResponse.statusText}`,
        rawResponse.status,
        data,
        fullUrl,
      );
      for (const interceptor of this.interceptors) {
        interceptor.onError?.(error);
      }
      throw error;
    }

    let response: HttpResponse<T> = {
      data,
      status: rawResponse.status,
      headers: responseHeaders,
      ok: rawResponse.ok,
    };

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        response = await interceptor.onResponse(response);
      }
    }

    return response;
  }

  private applyDefaults(config: HttpRequestConfig): HttpRequestConfig {
    return {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };
  }

  private withTimeout(promise: Promise<Response>, ms: number): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout after ${ms}ms`));
      }, ms);
      promise
        .then(res => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }
}
