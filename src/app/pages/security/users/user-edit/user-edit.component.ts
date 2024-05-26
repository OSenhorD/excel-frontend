import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms"

import { Subscription } from "rxjs"

import { PageEditComponent } from "src/app/components/page-edit.component"
import { InputComponent } from "src/app/components/forms/input.component"
import { EmailComponent } from "src/app/components/forms/email.component"
import { PasswordComponent } from "src/app/components/forms/password.component"
import { ToggleComponent } from "src/app/components/forms/toggle.component"
import { UploadComponent } from "src/app/components/forms/upload.component"
import { LoadingComponent } from "src/app/components/loading.component"

import { AlertService } from "src/app/services/alert.service"
import { RestService } from "src/app/services/rest.service"
import { PageService } from "src/app/services/page.service"

import { HttpResponse } from "src/app/interfaces/shared/http"

import { IEditLiterals, IUserGetRes } from "src/app/interfaces/pages/security/user"

@Component({
  selector: "page-user-edit",
  standalone: true,
  templateUrl: "./user-edit.component.html",
  imports: [
    ReactiveFormsModule,
    PageEditComponent,
    InputComponent,
    EmailComponent,
    PasswordComponent,
    ToggleComponent,
    UploadComponent,
    LoadingComponent,
  ],
})

export class UserEditComponent implements OnInit, OnDestroy {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _alertService: AlertService = inject(AlertService)
  private readonly _restService: RestService = inject(RestService)
  private readonly _pageService: PageService = inject(PageService)

  @Input() protected id!: string

  protected literals: IEditLiterals = {
    page_edit: {
      title: "Usuários",
    },
    form: {
      name: {
        label: "Nome",
        placeholder: "Digite o nome de usuário",
      },
      email: {
        label: "E-mail",
        placeholder: "Digite o e-mail de usuário",
      },
      password: {
        label: "Senha",
        placeholder: "Digite a senha do usuário",
      },
      avatar: {
        label: "Avatar",
      },
      isAdmin: {
        label: "Admin?",
      },
      isActive: {
        label: "Ativo?",
      },
    },
    api: {
      post: "Usuário salvo com sucesso!",
      put: "Usuário editado com sucesso!",
    },
  }

  protected readonly form = this._formBuilder.group(
    {
      name: new FormControl("", { nonNullable: true }),
      email: new FormControl("", { nonNullable: true }),
      password: new FormControl("", { nonNullable: true }),
      avatar: new FormControl(""),
      isActive: new FormControl(true),
      isAdmin: new FormControl(false),
    },
  )

  private readonly _subscriptions = new Subscription()

  protected readonly: boolean = false
  protected pageType: "new" | "edit" | "view" = "edit"

  protected isLoading: boolean = true

  ngOnInit(): void {
    this.pageType = this._pageService.pageType
    this.readonly = this.pageType === "view"

    if (this.id) {
      this._getData()
      return
    }

    this.isLoading = false
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  protected isNew = (): boolean => this.pageType == "new"

  protected onSave = (): void => {
    this.id && this.pageType === "edit" ? this._saveEdit() : this._saveCreate()
  }

  protected goBack = () => {
    this.form.reset()
    this._pageService.back({ queryParams: this._pageService.queryParams })
  }

  private _saveCreate = (): void => {
    const formData = new FormData()

    formData.append("name", `${this.form.value.name || ""}`)
    formData.append("email", `${this.form.value.email || ""}`)
    formData.append("isAdmin", `${this.form.value.isAdmin == true}`)
    formData.append("isActive", `${this.form.value.isActive == true}`)

    // TODO: Encriptar a senha
    if (this.pageType === "new") {
      formData.append("password", `${btoa(this.form.value.password || "")}`)
    }

    if (this.form.value?.avatar && this.form.value.avatar) {
      formData.append("avatar", this.form.value.avatar)
    }

    const headers: { [header: string]: string } = {
      "-Content-Type": "multipart/form-data",
    }

    this._subscriptions.add(
      this._restService
        .post(`/security/users`, formData, headers)
        .subscribe({
          complete: () => {
            this._alertService.success(this.literals.page_edit.title, this.literals?.api.post)
            this.goBack()
          },
          error: (error: Error) => console.error(error?.message || error),
        })
    )
  }

  private _saveEdit = (): void => {
    const formData = new FormData()

    formData.append("name", `${this.form.value.name || ""}`)
    formData.append("email", `${this.form.value.email || ""}`)
    formData.append("isAdmin", `${this.form.value.isAdmin == true}`)
    formData.append("isActive", `${this.form.value.isActive == true}`)

    if (this.form.value?.avatar && this.form.value.avatar) {
      formData.append("avatar", this.form.value.avatar)
    }

    const headers: { [header: string]: string } = {
      "-Content-Type": "multipart/form-data",
    }

    this._subscriptions.add(
      this._restService
        .put(`/security/users/${this.id}`, formData, headers)
        .subscribe({
          complete: () => {
            this._alertService.success(this.literals.page_edit.title, this.literals?.api.put)
            this.goBack()
          },
          error: (error: Error) => console.error(error?.message || error),
        })
    )
  }

  private _getData = (): void => {
    this._subscriptions.add(
      this._restService
        .get(`/security/users/${this.id}`)
        .subscribe({
          next: (result: HttpResponse<IUserGetRes>) => {
            const data = result.data

            this.form.patchValue({
              name: data?.name,
              email: data?.email,
              avatar: data?.avatar,
              isAdmin: data?.isAdmin == true,
              isActive: data?.isActive == true,
            }, { emitEvent: true })

            this.isLoading = false
          },
          error: (error: Error) => console.error(error?.message || error),
        })
    )
  }
}
