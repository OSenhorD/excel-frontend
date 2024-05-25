import { CommonModule } from "@angular/common"

import {
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core"

import { PageService } from "src/app/services/page.service"
import { AuthService, IResponseAuthUser } from "../services/authenticate/auth.service"

export interface IMenu {
  id: string
  label: string
  route: string
  icon?: string
  children: Omit<IMenu, "icon">[]
}

export interface IMenuliterals {
  open_menu: string
  log_out: string
}

@Component({
  selector: "custom-menu",
  standalone: true,
  templateUrl: "./menu.component.html",
  imports: [
    CommonModule,
  ],
})

export class MenuComponent {
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _pageService: PageService = inject(PageService)

  protected literals = {
    open_menu: "Abrir Menu",
    log_out: "Sair",
  }

  protected noImage: string = "assets/images/no-image-avatar.jpg"

  @Input("menus") allMenus: IMenu[] = []

  protected open: boolean = false
  protected childrenOpen: string = ""

  protected get user(): IResponseAuthUser {
    return this._authService.user.user || {}
  }

  protected editPerfil = () => {
    this.open = false
    this._pageService.goTo("/perfil")
  }

  protected showNotifications = () => { }

  protected exit = () => {
    this._authService.signOut()
  }

  protected openMenu = () => {
    this.open = true

    const closeOutside = (event: any) => {
      event.preventDefault()

      if (event?.target?.id == "box" || event?.target?.tagName == "BODY") {
        event.target?.removeEventListener("click", closeOutside)
        this.open = false
      }
    }

    if (this.open) {
      document.body.addEventListener("click", closeOutside)
    }
  }

  protected go = (route: string) => {
    if (!route) return

    this._pageService.goTo(route)
    if (!this.open) return

    this.openMenu()
  }
}
