import { Component } from "@angular/core"

import { PageListComponent } from "src/app/components/page-list.component"
import { ITableColumn } from "src/app/components/table.component"

import { IListLiterals, IUserListRes } from "src/app/interfaces/pages/security/user"

@Component({
  selector: "page-user-list",
  standalone: true,
  templateUrl: "./user-list.component.html",
  imports: [
    PageListComponent,
  ],
})

export class UserListComponent {
  protected items: IUserListRes[] = []

  protected literals: IListLiterals = {
    title: "Cadastro de Usuários",
    columns: {
      name: "Nome",
      email: "E-mail",
      isAdmin: {
        label: "Admin?",
        labels: {
          true: "SIM",
          false: "NÃO",
        },
      },
      isActive: {
        label: "Ativo?",
        labels: {
          true: "SIM",
          false: "NÃO",
        },
      },
    },
  }

  protected columns: ITableColumn[] = [
    {
      property: "name",
      label: this.literals.columns.name,
    },
    {
      property: "email",
      icon: {
        name: "fa-solid fa-envelope-circle-check",
        class: {
          "text-green-600": true,
        },
      },
      label: this.literals.columns.email,
    },
    {
      property: "isAdmin",
      label: this.literals.columns.isAdmin.label,
      type: "label",
      labels: [
        {
          value: true,
          label: this.literals.columns.isAdmin.labels.true,
          class: {
            "bg-green-100": true,
            "text-green-800": true,
            "dark:bg-green-900": true,
            "dark:text-green-300": true,
          },
        },
        {
          value: false,
          label: this.literals.columns.isAdmin.labels.false,
          class: {
            "bg-red-100": true,
            "text-red-800": true,
            "dark:bg-red-900": true,
            "dark:text-red-300": true,
          },
        },
      ],
    },
    {
      property: "isActive",
      label: this.literals.columns.isActive.label,
      type: "label",
      labels: [
        {
          value: true,
          label: this.literals.columns.isActive.labels.true,
          class: {
            "bg-green-100": true,
            "text-green-800": true,
            "dark:bg-green-900": true,
            "dark:text-green-300": true,
          },
        },
        {
          value: false,
          label: this.literals.columns.isActive.labels.false,
          class: {
            "bg-red-100": true,
            "text-red-800": true,
            "dark:bg-red-900": true,
            "dark:text-red-300": true,
          },
        },
      ],
    },
  ]
}
