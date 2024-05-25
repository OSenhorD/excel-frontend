import { inject, Injectable } from "@angular/core"

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http"

import { Observable } from "rxjs"

import { AuthService } from "src/app/services/authenticate/auth.service"
import { RestService } from "src/app/services/rest.service"

@Injectable({
  providedIn: "root",
})

export class TokenInterceptorService implements HttpInterceptor {
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _restService: RestService = inject(RestService)

  intercept = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
    const user = this._authService.user
    const isLoggedIn = user && user?.token
    const isApiUrl = req.url.startsWith(this._restService.baseUrl)

    if (isLoggedIn && isApiUrl && !req.headers.has("Authorization")) {
      req = req.clone({
        headers: req.headers.append("Authorization", `Bearer ${user.token}`),
      })
    }

    return next.handle(req)
  }
}
