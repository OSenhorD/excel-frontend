import { Component, inject } from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"

import { AuthService } from "src/app/services/authenticate/auth.service"
import { PageService } from "src/app/services/page.service"

@Component({
  selector: "auth-recovery",
  standalone: true,
  templateUrl: "./recovery.component.html",
  imports: [
    ReactiveFormsModule,
  ],
})

export class RecoveryComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _pageService: PageService = inject(PageService)

  protected literals = {
    title: "Esqueceu sua senha?",
    sub_title: "Não se preocupe! Basta digitar seu e-mail e enviaremos um código para redefini-lá!",
    back: "Voltar",
    on_submit: "Enviar e-mail",
    form: {
      email: {
        label: "E-mail",
        placeholder: "example@example.com",
      },
    },
  }

  protected readonly form = this._formBuilder.group(
    {
      email: new FormControl("", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ],
      }),
    },
  )

  protected isLoading: boolean = false

  onSubmit = async (): Promise<void> => {
    if (!this.form.valid) {
      return
    }

    this.isLoading = true

    const payload = {
      login: this.form.value?.email || "",
    }
    await this._authService.recoverySend(payload)

    this.isLoading = false
  }

  back = () => this._pageService.goTo("login")

  protected emailOnKeydown = (event: KeyboardEvent): void => {
    if (event.key != "Enter") return
    this.onSubmit()
  }
}
