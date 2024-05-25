import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core"

import { ModalComponent } from "src/app/components/modal.component"

export interface IPageEditLiterals {
  title: string
  buttons?: {
    new?: string
    edit?: string
    discart?: string
    close?: string
  }
  discart_modal?: {
    text?: string
    confirm?: string
    cancel?: string
  }
}

@Component({
  selector: "custom-page-edit",
  standalone: true,
  templateUrl: "./page-edit.component.html",
  imports: [
    ModalComponent,
  ],
})

export class PageEditComponent {
  @Input("page-type") pageType: "new" | "edit" | "view" = "view"
  @Input({ transform: booleanAttribute }) disabled: boolean = true

  @Input({ transform: transformLiterals }) literals: IPageEditLiterals = {
    title: "Cadastro de Item",
    buttons: {
      new: "Criar",
      edit: "Salvar",
      discart: "Descartar",
      close: "Fechar",
    },
    discart_modal: {
      text: "Tem certeza que deseja descartar as alterações?",
      confirm: "Sim, eu tenho!",
      cancel: "Não, cancelar!",
    },
  }

  @Output("on-save") protected readonly onSaveEvent = new EventEmitter()
  @Output("on-close") protected readonly onCloseEvent = new EventEmitter()
  @Output("on-discart") protected readonly onDiscartEvent = new EventEmitter()

  protected isDiscart: boolean = false
}

function transformLiterals(literals?: IPageEditLiterals): IPageEditLiterals {
  return {
    title: literals?.title || "Cadastro de Item",
    buttons: {
      new: literals?.buttons?.new || "Criar",
      edit: literals?.buttons?.edit || "Salvar",
      discart: literals?.buttons?.discart || "Descartar",
      close: literals?.buttons?.close || "Fechar",
    },
    discart_modal: {
      text: literals?.discart_modal?.text || "Tem certeza que deseja descartar este registro?",
      confirm: literals?.discart_modal?.confirm || "Sim, eu tenho!",
      cancel: literals?.discart_modal?.cancel || "Não, cancelar!",
    },
  }
}
