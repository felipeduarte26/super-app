import {FetchHttpClient} from './FetchHttpClient';
import type {IHttpClient} from './types';

type HttpClientProvider = () => IHttpClient;

let provider: HttpClientProvider = () => new FetchHttpClient();

/**
 * Strategy pattern — permite trocar a implementação HTTP em runtime.
 *
 * Uso padrão (fetch nativo):
 *   const client = HttpClientFactory.create();
 *
 * Trocar para Axios (ou qualquer lib):
 *   HttpClientFactory.setProvider(() => new AxiosHttpClient());
 */
export class HttpClientFactory {
  static create(): IHttpClient {
    return provider();
  }

  static setProvider(newProvider: HttpClientProvider): void {
    provider = newProvider;
  }

  static resetProvider(): void {
    provider = () => new FetchHttpClient();
  }
}
