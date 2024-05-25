import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"

import { Observable } from "rxjs"

import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})

export class RestService {
  private readonly _http: HttpClient = inject(HttpClient)
  private _headers!: HttpHeaders

  constructor() {
    this._headers = this._setHeader(this._headers, "Content-Type", "application/json")
  }

  get baseUrl() {
    return environment.baseUrl
  }

  get = (url: string, ...args: { [header: string]: string }[]): Observable<any> => {
    url = url.startsWith("http") ? `${url}` : `${this.baseUrl}${url}`
    const { headers, params } = this._setHeadersDefault(args)
    return this._http.get(url, { headers, params })
  }

  put = (url: string, body: any, ...args: { [header: string]: string }[]) => {
    url = url.startsWith("http") ? `${url}` : `${this.baseUrl}${url}`
    const { headers } = this._setHeadersDefault(args)
    return this._http.put(url, body, { headers })
  }

  post = (url: string, body: any, ...args: { [header: string]: string }[]) => {
    url = url.startsWith("http") ? `${url}` : `${this.baseUrl}${url}`
    const { headers } = this._setHeadersDefault(args)
    return this._http.post(url, body, { headers })
  }

  patch = (url: string, body: any, ...args: { [header: string]: string }[]) => {
    url = url.startsWith("http") ? `${url}` : `${this.baseUrl}${url}`
    const { headers } = this._setHeadersDefault(args)
    return this._http.patch(url, body, { headers })
  }

  delete = (url: string, ...args: { [header: string]: string }[]) => {
    url = url.startsWith("http") ? `${url}` : `${this.baseUrl}${url}`
    const { headers } = this._setHeadersDefault(args)
    return this._http.delete(url, { headers })
  }

  private _setHeader = (headers: HttpHeaders, name: string, value: string | string[]): HttpHeaders => {
    headers = !headers ? new HttpHeaders() : headers

    if (name.startsWith("-")) {
      if (headers.has(name.slice(1))) {
        headers = headers.delete(name.slice(1))
      }

      return headers
    }

    if (!headers.has(name)) {
      headers = headers.set(name, value)
    } else if (headers.get(name) != name) {
      headers = headers.set(name, value)
    }

    return headers
  }

  private _setHeadersDefault = (args: { [header: string]: string }[]): { headers: HttpHeaders, params: HttpParams } => {
    let headers = Object.assign(new HttpHeaders(), this._headers)
    let params = new HttpParams()

    args.forEach((arg) => {
      if (arg?.["queryParams"]) {
        params = arg["queryParams"] as any
      } else {
        Object.keys(arg).forEach(key => headers = this._setHeader(headers, key, arg[key]))
      }
    })

    return { headers, params }
  }
}
