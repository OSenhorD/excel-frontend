import {
  Component,
  inject,
  OnInit,
} from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms"

import { ActivatedRoute } from "@angular/router"

import { Subscription } from "rxjs"

import { AuthService } from "src/app/services/authenticate/auth.service"
import { AlertService } from "src/app/services/alert.service"
import { PageService } from "src/app/services/page.service"
import { RestService } from "src/app/services/rest.service"
import { EqualService } from "src/app/services/validators/equal.service"

import { PasswordComponent } from "src/app/components/forms/password.component"

interface ILiterals {
  back: string
  on_submit: string
  valid: {
    title: string
    sub_title: string
  }
  invalid: {
    title: string
    sub_title: string
  }
  success: {
    title: string
    message: string
  }
  form: {
    password: {
      label: string
      placeholder: string
    }
    repeatPassword: {
      label: string
      placeholder: string
    }
  }
  actions: {
    update: string
  }
}

@Component({
  selector: "auth-new-password",
  standalone: true,
  templateUrl: "./new-password.component.html",
  imports: [
    ReactiveFormsModule,
    PasswordComponent,
  ],
})

export class NewPasswordComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _equalService: EqualService = inject(EqualService)
  private readonly _pageService: PageService = inject(PageService)
  private readonly _restService: RestService = inject(RestService)
  private readonly _alertService: AlertService = inject(AlertService)

  protected literals: ILiterals = {
    back: "Voltar",
    on_submit: "Enviar e-mail",
    valid: {
      title: "Altere sua Senha",
      sub_title: "Tudo certo até aqui, basta apenas digitar sua nova senha e salvar",
    },
    invalid: {
      title: "Altere sua Senha",
      sub_title: "O token informado não é válido, tente reenviar o e-mail de recuperação de senha",
    },
    success: {
      title: "Recuperação de Senha",
      message: "A senha foi alterada com sucesso"
    },
    form: {
      password: {
        label: "Senha",
        placeholder: "",
      },
      repeatPassword: {
        label: "Repita a Senha",
        placeholder: "",
      },
    },
    actions: {
      update: "Atualizar",
    },
  }

  private readonly _subscriptions = new Subscription()

  protected readonly form = this._formBuilder.group(
    {
      password: new FormControl("", { nonNullable: true }),
      repeatPassword: new FormControl("", { nonNullable: true }),
    },
    {
      validators: [
        this._equalService.equals("password", "repeatPassword", this.literals?.form?.password.label, this.literals?.form?.repeatPassword.label),
        this._equalService.equals("repeatPassword", "password", this.literals?.form?.repeatPassword.label, this.literals?.form?.password.label),
      ],
    }
  )

  protected isLoading: boolean = false

  private _validToken: boolean = false

  ngOnInit(): void {
    this._validate()
  }

  protected get isValidForm(): boolean {
    return this.form.valid
  }

  protected get isValidToken(): boolean {
    return this._validToken
  }

  private get _token(): string {
    return this._activatedRoute?.snapshot?.queryParams["recoveryToken"]
  }

  back = () => this._pageService.goTo("recovery")

  protected recovery = (): void => {
    this.isLoading = true

    const payload = {
      token: this._token,
      password: btoa(this.form.value.password || ""),
    }

    this._subscriptions.add(
      this._restService
        .post(`/auths/recovery/new-password`, payload)
        .subscribe({
          complete: () => {
            this.isLoading = false
            const { title, message } = this.literals?.success
            this._alertService.success(title, message)
            this._pageService.goTo("/login")
          },
          error: (error: Error) => {
            this.isLoading = false
            console.log(error?.message)
          },
        })
    )
  }

  private _validate = async (): Promise<void> => {
    if (!this._token) return

    this._validToken = await this._authService.recoveryTokenValid(this._token)
  }
}
