import {
  Component,
  inject,
  OnInit,
} from "@angular/core"

import { RouterModule } from "@angular/router"

import { IMenu, MenuComponent } from "src/app/components/menu.component"

import { AuthService, IResponseAuthUser } from "src/app/services/authenticate/auth.service"

@Component({
  selector: "layout-default",
  standalone: true,
  imports: [
    RouterModule,
    MenuComponent,
  ],
  template: `
    <custom-menu [menus]="menus"></custom-menu>

    <div class="p-4 md:ml-64">
      <router-outlet></router-outlet>
    </div>
  `,
})

export class DefaultComponent implements OnInit {
  private readonly _authService: AuthService = inject(AuthService)

  protected menus: IMenu[] = []

  ngOnInit(): void {
    if (this.user.isAdmin) {
      this.menus = [
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

    this.menus = [
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

  protected get user(): IResponseAuthUser {
    return this._authService.user.user || {}
  }
}
