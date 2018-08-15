// TODO: TEMP HACK ONLY!! GET BACK HERE WHEN YOU FIND A SOLUTION

import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MNMHttpOptions} from './mnm-http-options';
import {MNMHttpInterceptor} from './mnm-http.interceptor';
import {Observable} from 'rxjs';
import {Result} from '../../models/result';

/**
 * Created by mohammed on 4/5/17.
 */

function convertOptions(options: MNMHttpOptions, stealth: boolean): {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
} {
  const params: HttpParams = options ? options.search ? options.search.convert() : new HttpParams() : new HttpParams();
  let headers = new HttpHeaders();

  if (options && options.headers) {
    for (const k in options.headers) {
      if (options.headers.hasOwnProperty(k)) {
        headers = headers.append(k, options.headers[k]);
      }
    }
  }

  return {
    headers: headers,
    observe: 'body',
    params: params.set(MNMHttpInterceptor.STEALTH, `${stealth}`),
    reportProgress: false,
    responseType: 'json',
    withCredentials: false
  };
}


@Injectable()
export class MNMHttpService {

  constructor(private _httpClient: HttpClient) {
  }

  /**
   * Performs a request with `get` http method.
   */
  get<T = any>(url: string, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.get<Result<T>>(url, opts);
  }


  /**
   * Performs a request with `post` http method.
   */
  post<T = any>(url: string, body: any, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.post<Result<T>>(url, body, opts);
  }

  /**
   * Performs a request with `put` http method.
   */
  put<T = any>(url: string, body: any, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.put<Result<T>>(url, body, opts);
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete<T = any>(url: string, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.delete<Result<T>>(url, opts);
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch<T = any>(url: string, body: any, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.patch<Result<T>>(url, body, opts);
  }

  /**
   * Performs a request with `head` http method.
   */
  head<T = any>(url: string, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.head<Result<T>>(url, opts);
  }

  /**
   * Performs a request with `options` http method.
   */
  options<T = any>(url: string, options?: MNMHttpOptions, stealth: boolean = false): Observable<Result<T>> {
    const opts = convertOptions(options, stealth);
    return this._httpClient.options<Result<T>>(url, opts);
  }


}
