import * as _ from 'lodash';
import { startsWith } from 'lodash';
import { axiosInstance } from '.';

export class ApiClient {
  private _timeout = 20000;

  constructor(private _baseUrl: string, private _accessToken?: string) {
    // console.debug('api endpoint is set to: ', _baseUrl);
  }

  async get<T>(path: string, params?: object, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return await axiosInstance.get(this.url(path), {
      params,
      headers: requireAuth ? this.authHeaders() : null,
      timeout: this._timeout,
    });
  }

  async post<T>(path: string, params?: object, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return await axiosInstance.post(this.url(path), params, {
      headers: requireAuth ? this.authHeaders() : null,
      timeout: this._timeout,
    });
  }

  async put<T>(path: string, params?: object, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return await axiosInstance.put(this.url(path), params, {
      headers: requireAuth ? this.authHeaders() : null,
      timeout: this._timeout,
    });
  }

  async delete<T>(path: string, params?: object, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return await axiosInstance.delete(this.url(path), {
      params,
      headers: requireAuth ? this.authHeaders() : null,
      timeout: this._timeout,
    });
  }

  set accessToken(token: string) {
    this._accessToken = token;
  }

  private authHeaders(headers?: object) {
    return {
      ...(headers || {}),
      Authorization: this._accessToken,
    };
  }

  private url(path: string) {
    if (startsWith(path, 'http')) {
      return path;
    }
    return `${this._baseUrl}${path}`;
  }
}

export interface ApiResponse<T> {
  returnCode: number;
  errorString?: string;
  result: T | Pageable<T> | T[];
}

export interface ApiGssResponse<T> {
  success: boolean;
  data: T | Pageable<T> | T[];
}

export interface Pageable<T> {
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  content: T[];
}
