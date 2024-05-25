import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http"

import { inject, Injectable } from "@angular/core"

import { Observable, of, throwError } from "rxjs"
import { catchError } from "rxjs/operators"

import { environment } from "src/environments/environment"

import { PageService } from "src/app/services/page.service"
import { AlertService } from "src/app/services/alert.service"

@Injectable({
  providedIn: "root"
})

export class ErrorInterceptorService implements HttpInterceptor {
  intercept = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
    const _pageService: PageService = inject(PageService)
    const _alertService: AlertService = inject(AlertService)

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!error) return of()

        if (error?.status === 0) {
          const title = "Erro interno"
          const message = "Falha ao se comunicar com o servidor!"
          _alertService.error(title, message)
          return throwError(() => error)
        }

        if (error?.error?.customCode) {
          _alertService.info("", error.error.error.message)
          return throwError(() => error)
        }

        if (error?.status === 400) {
          _alertService.error("", error.error.error.message)
          return throwError(() => error)
        }

        if (error?.status === 401) {
          _alertService.error("", error.error.error.message)
          if (error?.error?.error?.name == "NoTokenError" && error.url != `${environment.baseUrl}/auths/recovery/is-valid-token`) {
            _pageService.goTo("/login")
          }
          return throwError(() => error)
        }

        if (error?.status === 404) {
          _alertService.error("", error.error.error.message)
          return throwError(() => error)
        }

        if (error?.error?.error?.message) {
          _alertService.error("", error.error.error.message)
          return throwError(() => error)
        }

        if (error?.error?.error) {
          _alertService.error("", error.error.error)
          return throwError(() => error)
        }

        return throwError(() => error)
      }),
    )
  }
}
