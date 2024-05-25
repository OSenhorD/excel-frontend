import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core"

import { Subscription } from "rxjs"

import {
  ITableColumn,
  ITableLiterals,
  TableComponent,
} from "src/app/components/table.component"

import { ITableAction } from "src/app/components/table-actions.component"
import { ModalComponent } from "src/app/components/modal.component"

import { AlertService } from "src/app/services/alert.service"
import { PageService } from "src/app/services/page.service"
import { RestService } from "src/app/services/rest.service"

import { IItem, IParams } from "src/app/interfaces/shared/shared"
import { HttpResponseList } from "src/app/interfaces/shared/http"

export interface IPageListLiterals {
  table: ITableLiterals,
  modal_delete: {
    text: string
    confirm: string
    cancel: string
    success: {
      title: string
      message: string
    }
  }
}

@Component({
  selector: "custom-page-list",
  standalone: true,
  templateUrl: "./page-list.component.html",
  imports: [
    TableComponent,
    ModalComponent,
  ],
})

export class PageListComponent implements OnInit, OnDestroy {
  private readonly _pageService: PageService = inject(PageService)
  private readonly _restService: RestService = inject(RestService)
  private readonly _alertService: AlertService = inject(AlertService)

  @Input({ required: true }) title!: string
  // Rota para a tela de novo, edição, visualização e cópia
  @Input({ required: true }) route: string = ""
  // API para consumo: GET, POST, PUT e DELETE
  @Input({ required: true }) api: string = ""

  protected _page: number = 0
  @Input("page-size") pageSize: number = Math.round((document.body.clientHeight - 325) / 100 * 2)
  @Input("count-total-items") countTotalItems: number = 0

  protected filterParams!: IParams
  // Parâmetros que serão usados na construção da url para consumo da API
  @Input("params") customParams!: IParams
  // Parâmetros que serão usados na construção do formulário de criação, edição ou visualização
  @Input("params-form") customParamsForm!: IParams

  @Input("actions") moreActions: ITableAction[] = []
  @Input("exclude-actions") excludeActions: string[] = []

  @Input() items: IItem[] = []
  @Input("table-columns") tableColumns: ITableColumn[] = []
  @Input() literals: IPageListLiterals = {
    table: {
      all_items: "Todos os itens",
      table_settings: "Configurações",
      clear_filters: {
        title: "Limpar Filtros",
        message: "Filtros limpos com sucesso",
      },
      search: {
        label: "Pesquisar",
        placeholder: "Pesquisar registros",
      },
      actions: {
        refresh: "Recarregar",
        add: "Novo",
        edit: "Editar",
        view: "Visualizar",
        delete: "Deletar",
        more_actions: "Mais Ações",
      },
    },
    modal_delete: {
      text: "Tem certeza que deseja deletar o registro?",
      confirm: "Sim, eu tenho!",
      cancel: "Não, cancelar!",
      success: {
        title: "Exclusão de registro",
        message: "O registro foi excluido com sucesso!",
      },
    },
  }

  @Output("on-table-selected") protected readonly onTableSelectedEvent = new EventEmitter<IItem>()
  @Output("on-table-unselected") protected readonly onTableUnselectedEvent = new EventEmitter<IItem>()
  @Output("on-table-all-selected") protected readonly onTableAllSelectedEvent = new EventEmitter<IItem>()
  @Output("on-table-all-unselected") protected readonly onTableAllUnselectedEvent = new EventEmitter<IItem>()

  private readonly _subscriptions = new Subscription()

  protected defaultActions: ITableAction[] = [
    {
      name: "refresh",
      label: this.literals.table.actions.refresh,
      icon: "fa-solid fa-rotate-right",
      order: 10,
      class: {
        "bg-gray-700": true,
        "hover:bg-gray-800": true,
        "focus:ring-gray-300": true,
        "dark:bg-gray-600": true,
        "dark:hover:bg-gray-700": true,
        "dark:focus:ring-gray-800": true,
      },
      visible: () => !this.items.some(item => item.$selected),
      action: () => this.refresh(),
    },
    {
      name: "add",
      label: this.literals.table.actions.add,
      icon: "fa-solid fa-circle-plus",
      order: 100,
      class: {
        "bg-green-700": true,
        "hover:bg-green-800": true,
        "focus:ring-green-300": true,
        "dark:bg-green-600": true,
        "dark:hover:bg-green-700": true,
        "dark:focus:ring-green-800": true,
      },
      // TODO: Permissão por usuário
      visible: () => !this.items.some(item => item.$selected),
      action: () => {
        this._pageService.goTo(`${this.route}/new`, { queryParams: { ...this.customParams, ...this.customParamsForm } })
      },
    },
    {
      name: "edit",
      label: this.literals.table.actions.edit,
      icon: "fa-solid fa-pen",
      order: 200,
      class: {
        "bg-blue-700": true,
        "hover:bg-blue-800": true,
        "focus:ring-blue-300": true,
        "dark:bg-blue-600": true,
        "dark:hover:bg-blue-700": true,
        "dark:focus:ring-blue-800": true,
      },
      visible: () => this.items.filter(item => item.$selected).length == 1,
      action: () => {
        const item = this.items.find(it => it.$selected)
        this._pageService.goTo(`${this.route}/edit/${item?.id}`, { queryParams: { ...this.customParams, ...this.customParamsForm } })
      },
    },
    {
      name: "view",
      label: this.literals.table.actions.view,
      icon: "fa-solid fa-eye",
      order: 300,
      class: {
        "bg-gray-700": true,
        "hover:bg-gray-800": true,
        "focus:ring-gray-300": true,
        "dark:bg-gray-600": true,
        "dark:hover:bg-gray-700": true,
        "dark:focus:ring-gray-800": true,
      },
      visible: () => this.items.filter(item => item.$selected).length == 1,
      action: () => {
        const item = this.items.find(it => it.$selected)
        this._pageService.goTo(`${this.route}/view/${item?.id}`, { queryParams: { ...this.customParams, ...this.customParamsForm } })
      },
    },
    {
      name: "delete",
      label: this.literals.table.actions.delete,
      icon: "fa-solid fa-trash",
      order: 400,
      class: {
        "bg-red-700": true,
        "hover:bg-red-800": true,
        "focus:ring-red-300": true,
        "dark:bg-red-600": true,
        "dark:hover:bg-red-700": true,
        "dark:focus:ring-red-800": true,
      },
      visible: () => this.items.filter(item => item.$selected).length == 1,
      action: () => this.showModalDelete = true,
    },
  ]

  protected showModalDelete: boolean = false

  protected search: string = ""

  protected isLoading: boolean = true

  ngOnInit(): void {
    const search = localStorage.getItem(`@excel:search`) || ""
    this.onFilter(search)
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  get actions(): ITableAction[] {
    return this.defaultActions
      .concat(...this.moreActions)
      .filter(act => !this.excludeActions.includes(act.name))
      .filter(act => typeof act.visible == "undefined" || act.visible(this.items))
      .sort((a, b) => a.order > b.order ? 1 : (a.order < b.order ? -1 : 0))
  }

  protected onPageSet = (page: number) => {
    this._page = page
    this._getData()
  }

  protected refresh = () => {
    this._page = 0

    const search = localStorage.getItem(`@excel:search`) || ""
    this.onFilter(search)
  }

  protected onFilter = (search: string) => {
    this.search = search
    localStorage.setItem(`@excel:search`, this.search)

    this.filterParams = {}

    this.tableColumns
      .map(col => col.property)
      .forEach(col => {
        const valuesStorage = (localStorage.getItem(`@excel:filter:${col}`) || "").split(";;;")
        if (valuesStorage[0].trim() == "") return

        this.filterParams[col] = valuesStorage.join(";")
      })

    this._page = 0
    this._getData()
  }

  protected onSearch = () => {
    localStorage.setItem(`@excel:search`, this.search)
    this._page = 0
    this._getData()
  }

  protected onConfirmToDelete = () => {
    const item = this.items.find(it => it.$selected)
    if (!item) return

    this._subscriptions.add(
      this._restService
        .delete(`/${this.api}/${item.id}`)
        .subscribe({
          next: () => {
            const { title, message } = this.literals.modal_delete.success
            this._alertService.success(title, message)
            this.onSearch()
          },
          error: (error: Error) => console.error(error),
        })
    )
  }

  private _getData = (): void => {
    this.isLoading = true

    const url = this._pageService.createUrl(
      this.api,
      this._page,
      this.pageSize,
      this.search,
      {
        ...this.filterParams,
        ...this.customParams,
      },
    )

    this._subscriptions.add(
      this._restService
        .get(url)
        .subscribe({
          next: (response: HttpResponseList) => {
            const items = Array.isArray(response?.items) ? response.items : []
            this.items.splice(0, this.items.length)
            this.items.push(...items)

            this.countTotalItems = response?.count || this.items.length
            this.isLoading = false
          },
          error: (error: Error) => console.error(error),
        })
    )
  }
}
