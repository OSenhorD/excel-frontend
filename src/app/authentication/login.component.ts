import { Component, inject } from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"

import { AuthService } from "src/app/services/authenticate/auth.service"
import { AlertService } from "src/app/services/alert.service"
import { PageService } from "src/app/services/page.service"

@Component({
  selector: "auth-login",
  standalone: true,
  templateUrl: "./login.component.html",
  imports: [
    ReactiveFormsModule,
  ],
})

export class LoginComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _alertService: AlertService = inject(AlertService)
  private readonly _pageService: PageService = inject(PageService)

  protected literals = {
    on_submit: {
      submit: "Entrar",
      formInvalid: {
        title: "Erro de login",
        message: "Verifique os campos e tente novamente",
      },
    },
    forgot_password: "Esqueceu sua senha?",
    form: {
      email: {
        label: "E-mail",
        placeholder: "example@example.com",
      },
      password: {
        label: "Senha",
        placeholder: "Senha",
      },
    },
  }

  protected readonly form = this._formBuilder.group(
    {
      email: new FormControl("isis@gmail.com", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ],
      }),
      password: new FormControl("senha12345", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      }),
    },
  )

  protected isLoading: boolean = false

  protected onSubmit = async (): Promise<void> => {
    if (!this.form.valid) {
      const title = this.literals.on_submit.formInvalid.title
      const message = this.literals.on_submit.formInvalid.message
      return this._alertService.warning(title, message)
    }

    this.isLoading = true

    const payload = {
      login: this.form.value?.email || "",
      password: this.form.value?.password || "",
    }

    await this._authService.signIn(payload)

    this.isLoading = false
  }

  protected onRecovery = () => {
    this._pageService.goTo("recovery")
  }

  protected emailOnKeydown = (event: KeyboardEvent): void => {
    if (event.key != "Enter") return
    this.onSubmit()
  }

  protected passwordOnKeydown = (event: KeyboardEvent): void => {
    if (event.key != "Enter") return
    this.onSubmit()
  }
}
