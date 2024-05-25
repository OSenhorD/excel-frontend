import { Component, inject } from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms"

import { Subscription } from "rxjs"

import { InputComponent } from "src/app/components/forms/input.component"
import { PasswordComponent } from "src/app/components/forms/password.component"
import { IUploadRestrictions, UploadComponent } from "src/app/components/forms/upload.component"
import { EmailComponent } from "src/app/components/forms/email.component"

import { AuthService } from "src/app/services/authenticate/auth.service"
import { AlertService } from "src/app/services/alert.service"
import { RestService } from "src/app/services/rest.service"
import { EqualService } from "src/app/services/validators/equal.service"

@Component({
  selector: "page-perfil",
  standalone: true,
  templateUrl: "./perfil.component.html",
  imports: [
    ReactiveFormsModule,
    InputComponent,
    PasswordComponent,
    EmailComponent,
    UploadComponent,
  ],
})

export class PerfilComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _equalService: EqualService = inject(EqualService)
  private readonly _restService: RestService = inject(RestService)
  private readonly _alertService: AlertService = inject(AlertService)

  private readonly _subscriptions = new Subscription()

  protected literals = {
    title: "Dados Pessoais",
    form: {
      actions: {
        send: "Atualizar dados",
      },
      fields: {
        name: {
          label: "Nome Completo",
          placeholder: "Digite o seu nome completo",
        },
        email: {
          label: "E-mail",
          placeholder: "Digite o seu e-mail preferencial",
        },
        avatar: {
          label: "Avatar",
        },
      },
    },
    updateData: {
      title: "Usuário",
      message: "Dados atualizados com sucesso",
    },
    updateAvatar: {
      title: "Usuário",
      message: "Avatar atualizado com sucesso",
    },
    newPassword: {
      title: "Usuário",
      message: "Senha atualizada com sucesso",
      actions: {
        open: "Atualizar Senha",
        on_submit: "Atualizar Senha",
        cancel: "Cancelar",
      },
      form: {
        fields: {
          password: {
            label: "Senha",
            placeholder: "Digite a sua nova senha",
          },
          repeatPassword: {
            label: "Repita a Senha",
            placeholder: "Repita a sua nova senha",
          },
        },
      },
    },
  }

  protected readonly form = this._formBuilder.group(
    {
      name: new FormControl("", { nonNullable: true }),
      email: new FormControl("", { nonNullable: true }),
      file: new FormControl("", { nonNullable: true }),
    },
  )

  protected readonly newPasswordForm = this._formBuilder.group(
    {
      password: new FormControl("", { nonNullable: true }),
      repeatPassword: new FormControl("", { nonNullable: true }),
    },
    {
      validators: [
        this._equalService.equals("password", "repeatPassword", this.literals?.newPassword?.form?.fields?.password?.label, this.literals?.newPassword?.form?.fields?.repeatPassword?.label),
        this._equalService.equals("repeatPassword", "password", this.literals?.newPassword?.form?.fields?.repeatPassword?.label, this.literals?.newPassword?.form?.fields?.password?.label),
      ],
    }
  )

  protected readonly fileRestrictions: IUploadRestrictions = {
    maxFileSize: 1048576, // 1mb
    minFileSize: 1,
    allowedExtensions: [".png", ".jpg"],
  }

  protected isEdit: boolean = false
  protected isLoading: boolean = false
  protected isUpdatePassword: boolean = false

  protected noImage: string = "assets/images/no-image-avatar.jpg"

  protected get user() {
    return this._authService.user.user
  }

  protected alterEdit = (): void => {
    if (this.isLoading) return

    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
    }, { emitEvent: false })

    this.isEdit = !this.isEdit
    this.isUpdatePassword = false
  }

  protected onFileSelected = async (file: File): Promise<void> => {
    if (!file) return

    const formData = new FormData()

    formData.append("avatar", file || "")

    this._subscriptions.add(this._updateAvatar(formData))
  }

  protected updateData = () => {
    this.isLoading = true

    const payload = {
      name: this.form.value.name || "",
      email: this.form.value.email || "",
    }

    this._subscriptions.add(
      this._restService
        .put(`/security/users/base/${this._authService.user.user.id}`, payload)
        .subscribe({
          next: (result: any) => {
            const user = this._authService.user
            this._authService.user = {
              ...user,
              user: {
                ...user.user,
                name: result?.data?.name,
                email: result?.data?.email,
              },
            }

            const { title, message } = this.literals.updateData
            this._alertService.success(title, message)

            this.isLoading = false
          },
          error: (error: Error) => console.log(error?.message),
        })
    )
  }

  protected onNewPassword = (): void => {
    const payload = {
      password: `${btoa(this.newPasswordForm.value.password as string)}`,
    }

    this._subscriptions.add(
      this._restService
        .put(`/security/users/password/${this._authService.user.user.id}`, payload)
        .subscribe({
          complete: () => {
            this.newPasswordForm.reset()

            const { title, message } = this.literals.newPassword
            this._alertService.success(title, message)
          },
          error: (error: Error) => console.log(error?.message),
        })
    )
  }

  private _updateAvatar = (data: FormData): Subscription => {
    const headers: { [header: string]: string } = {
      "-Content-Type": "multipart/form-data",
    }

    const id = this._authService.user.user.id
    return this._restService
      .put(`/security/users/avatar/${id}`, data, headers)
      .subscribe({
        next: (result: any) => {
          const user = this._authService.user
          this._authService.user = {
            ...user,
            user: {
              ...user.user,
              avatar: result?.data?.avatar,
            },
          }

          const { title, message } = this.literals.updateAvatar
          this._alertService.success(title, message)
        },
        error: (error: Error) => console.log(error?.message),
      })
  }
}
