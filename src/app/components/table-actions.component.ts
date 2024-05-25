import { CommonModule } from "@angular/common"
import { Component, Input } from "@angular/core"

import { IItem } from "src/app/interfaces/shared/shared"

import { DropdownComponent } from "src/app/components/dropdown.component"

export interface ITableAction {
  name: string
  label: string
  icon?: string
  order: number
  action: Function
  visible?: Function
  disable?: Function
  class?: { [key: string]: boolean | Function }
  style?: { [key: string]: string | Function }
}

export interface ITableActionsLiterals {
  refresh: string
  add: string
  edit: string
  view: string
  delete: string
  more_actions: string
}

@Component({
  selector: "custom-table-actions",
  standalone: true,
  templateUrl: "./table-actions.component.html",
  imports: [
    CommonModule,
    DropdownComponent,
  ],
})

export class TableActionsComponent {
  @Input() items: IItem[] = []

  @Input("actions") _actions: ITableAction[] = []

  @Input({ transform: transformLiterals }) literals: ITableActionsLiterals = {
    refresh: "Recarregar",
    add: "Novo",
    edit: "Editar",
    view: "Visualizar",
    delete: "Deletar",
    more_actions: "Mais Ações",
  }

  get actions(): ITableAction[] {
    return this._actions.slice(0, 3)
  }

  get moreActions(): ITableAction[] {
    return this._actions.slice(3, this._actions.length)
  }

  protected getClass = (action: ITableAction) => {
    if (!action?.class) return {}

    let obj: { [key: string]: boolean } = {}
    Object.keys(action.class).forEach(key => {
      const exec = action.class?.[key]
      if (typeof exec === "function") {
        obj[key] = exec(this.items)
        return
      }

      obj[key] = exec == true
    })

    return obj
  }

  protected getStyle = (action: ITableAction) => {
    if (!action?.style) return {}

    let obj: { [key: string]: string } = {}
    Object.keys(action.style).forEach(key => {
      const exec = action.style?.[key]
      if (typeof exec === "function") {
        obj[key] = exec(this.items)
        return
      }

      obj[key] = exec || ""
    })

    return obj
  }
}

function transformLiterals(literals?: ITableActionsLiterals): ITableActionsLiterals {
  return {
    refresh: literals?.refresh || "Recarregar",
    add: literals?.add || "Novo",
    edit: literals?.edit || "Editar",
    view: literals?.view || "Visualizar",
    delete: literals?.delete || "Deletar",
    more_actions: literals?.more_actions || "Mais Ações",
  }
}
