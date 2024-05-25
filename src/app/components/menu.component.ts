import { CommonModule } from "@angular/common"
import { Component, inject, OnInit } from "@angular/core"

import { PageService } from "src/app/services/page.service"
import { AuthService, IResponseAuthUser } from "../services/authenticate/auth.service"

interface IMenu {
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

export class MenuComponent implements OnInit {
  private readonly _authService: AuthService = inject(AuthService)
  private readonly _pageService: PageService = inject(PageService)

  protected literals = {
    open_menu: "Abrir Menu",
    log_out: "Sair",
  }

  protected noImage: string = "assets/images/no-image-avatar.jpg"

  protected allMenus: IMenu[] = []

  protected open: boolean = false
  protected childrenOpen: string = ""

  protected get user(): IResponseAuthUser {
    return this._authService.user.user || {}
  }

  ngOnInit(): void {
    if (this.user.isAdmin) {
      this.allMenus = [
        {
          id: "1",
          label: "Home",
          route: "home",
          icon: "fa-solid fa-house",
          children: [],
        },
        {
          id: "2",
          label: "Cadastro de Usuários",
          route: "security/users",
          icon: "fa-solid fa-users",
          children: [],
        },
        {
          id: "3",
          label: "Dados",
          route: "database/data",
          icon: "fa-solid fa-address-book",
          children: [],
        },
      ]
      return
    }

    this.allMenus = [
      {
        id: "1",
        label: "Home",
        route: "home",
        icon: "fa-solid fa-house",
        children: [],
      },
      {
        id: "3",
        label: "Dados",
        route: "database/data",
        icon: "fa-solid fa-address-book",
        children: [],
      },
    ]
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
    this.open = !this.open

    const closeOutside = (event: any) => {
      event.preventDefault()

      if (event?.target?.id == "box" || event?.target?.tagName == "BODY") {
        this.openMenu()
        event.target?.removeEventListener("click", closeOutside)
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
