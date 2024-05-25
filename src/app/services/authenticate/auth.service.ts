import { inject, Injectable } from "@angular/core"
import { Router } from "@angular/router"

import { AlertService } from "src/app/services/alert.service"
import { RestService } from "src/app/services/rest.service"

export interface IResponseAuthUser {
  id: string
  name: string
  avatar?: string
  email: string
  isAdmin: boolean
  isActive: boolean
}

interface IResponseAuth {
  token: string
  refreshToken: string
  user: IResponseAuthUser
}

interface ISignIn {
  login: string
  password: string
}

@Injectable({
  providedIn: "root",
})

export class AuthService {
  private readonly _router: Router = inject(Router)
  private readonly _restService: RestService = inject(RestService)
  private readonly _alertService: AlertService = inject(AlertService)

  protected literals = {
    sing_in: {
      title: "Login",
      message: "Login realizado com sucesso",
    },
    recovery: {
      title: "Recuperação de Senha",
      message: "Recuperação realizado com sucesso",
    },
    send_recovery: {
      title: "Recuperação de Senha",
      message: "E-mail enviado com sucesso",
    },
  }

  get user(): IResponseAuth {
    const user = JSON.parse(localStorage.getItem("@excel:user") || "{}")
    return user
  }

  set user(data: IResponseAuth) {
    localStorage.removeItem("@excel:user")
    localStorage.setItem("@excel:user", JSON.stringify(data))
  }

  isAdmin = (): boolean => this.user.user.isAdmin

  signIn = async ({ login, password }: ISignIn): Promise<void> => {
    password = btoa(password)

    return new Promise<void>((resolve) => {
      this._restService
        .post("/auths/login", { login, password })
        .subscribe({
          next: async (result: any) => {
            await this._signInSuccess(result.data)
            resolve()
          },
          error: (error) => {
            localStorage.removeItem("@excel:user")
            resolve()
          },
        })
    })
  }

  signOut = (): void => {
    localStorage.removeItem("@excel:user")
    this._router.navigate(["login"])
  }

  recoverySend = ({ login }: { login: string }): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      this._restService
        .post("/auths/recovery", { login })
        .subscribe({
          next: (_: any) => {
            const { title, message } = this.literals.send_recovery
            this._alertService.success(title, message)
            resolve(true)
          },
          error: (error) => resolve(false),
        })
    })
  }

  recoveryTokenValid = (token: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      this._restService
        .post("/auths/recovery/is-valid-token", { token })
        .subscribe({
          next: async (result: any) => resolve(result?.data == true),
          error: (error: Error) => resolve(false),
        })
    })
  }

  private _signInSuccess = async (response: IResponseAuth): Promise<void> => {
    this.user = response
    this._router.navigate(["home"])

    const { title, message } = this.literals.sing_in
    this._alertService.success(title, message)
  }
}
