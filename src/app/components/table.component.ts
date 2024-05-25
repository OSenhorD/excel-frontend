import { CommonModule } from "@angular/common"

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core"

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms"

import { debounceTime, distinctUntilChanged } from "rxjs"

import { PaginateComponent } from "src/app/components/paginate.component"
import { ISearchLiterals, SearchComponent } from "src/app/components/search.component"
import { SkeletonListComponent } from "src/app/components/skeleton-list.component"
import { FilterComponent } from "src/app/components/filter.component"

import {
  ITableAction,
  ITableActionsLiterals,
  TableActionsComponent,
} from "src/app/components/table-actions.component"

import { AlertService } from "src/app/services/alert.service"

import { IItem } from "src/app/interfaces/shared/shared"

interface IColumnStyle {
  class?: { [key: string]: boolean | Function }
  styles?: { [key: string]: string | Function }
}

interface IColumnImage extends IColumnStyle {
  propertySrc: string
  propertyAlt?: string
}

interface IColumnIcon extends IColumnStyle {
  name: string
}

interface IColumnLabel extends IColumnStyle {
  label: string
  value: string | number | boolean
}

type ITableTypeColumn = "string" | "number" | "label" | "icon" | "date" | "time" | "datetime" | "actions"

export interface ITableColumn extends IColumnStyle {
  property: string
  label: string
  type?: ITableTypeColumn
  format?: string
  icon?: IColumnIcon
  image?: IColumnImage
  labels?: IColumnLabel[]
}

export interface ITableSettings {
  selected?: boolean
  singleSelected?: boolean
}

export interface ITableLiterals {
  all_items: string
  table_settings: string
  clear_filters: {
    title: string
    message: string
  }
  search: ISearchLiterals,
  actions: ITableActionsLiterals
}

@Component({
  selector: "custom-table",
  standalone: true,
  templateUrl: "./table.component.html",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginateComponent,
    SearchComponent,
    TableActionsComponent,
    SkeletonListComponent,
    FilterComponent,
  ],
})

export class TableComponent implements OnInit {
  private readonly _alertService: AlertService = inject(AlertService)

  @Input() columns: ITableColumn[] = []
  @Input() items: IItem[] = []

  @Input() api: string = ""

  @Input() page: number = 0
  @Input("page-size") pageSize: number = 15
  @Input("count-total-items") countTotalItems: number = 0

  @Input("is-loading") isLoading: boolean = true

  @Input("actions") actions: ITableAction[] = []

  @Input({ transform: transformLiterals }) literals: ITableLiterals = {
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
  }

  @Input({ transform: transformSettings }) settings: ITableSettings = {
    selected: true,
    singleSelected: true,
  }

  @Output("on-page-set") protected readonly onPageSetEvent = new EventEmitter<number>()

  @Output("on-search") protected readonly onSearchEvent = new EventEmitter<string>()
  @Output("on-filter") protected readonly onFilterEvent = new EventEmitter<string>()

  @Output("on-selected") protected readonly onSelectedEvent = new EventEmitter<IItem>()
  @Output("on-unselected") protected readonly onUnselectedEvent = new EventEmitter<IItem>()
  @Output("on-all-selected") protected readonly onAllSelectedEvent = new EventEmitter<IItem>()
  @Output("on-all-unselected") protected readonly onAllUnselectedEvent = new EventEmitter<IItem>()

  protected readonly formSearch: FormControl<string> = new FormControl("", { nonNullable: true })

  ngOnInit(): void {
    this.formSearch.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((res) => {
      this.page = 0
      this.onSearchEvent.emit(res)
    })
  }

  protected onFilter = () => {
    const search = localStorage.getItem(`@excel:search`) || ""
    this.onFilterEvent.emit(search)
  }

  protected onClearFilters = () => {
    localStorage.removeItem(`@excel:search`)
    this.formSearch.setValue("", { emitEvent: false })

    this.columns
      .map(col => col.property)
      .forEach(col => localStorage.removeItem(`@excel:filter:${col}`))

    const { title, message } = this.literals.clear_filters
    this._alertService.success(title, message)

    this.onFilterEvent.emit()
  }

  protected onPageSet = (page: number) => {
    this.page = page
    this.onPageSetEvent.emit(page)
  }

  protected onChangeSelected = (item: IItem, idx: number): void => {
    if (this.settings.singleSelected) {
      this.items.filter((item, idxL) => item.$selected && idx != idxL).forEach(item => item.$selected = false)
    }

    item.$selected = !item.$selected
    item.$selected ? this.onSelectedEvent.emit(item) : this.onUnselectedEvent.emit(item)
  }

  protected getClass = (item: IItem, column: ITableColumn, idxItem: number, idxColumn: number, classe?: { [key: string]: boolean | Function }) => {
    if (!classe) return {}

    let obj: { [key: string]: boolean } = {}
    Object.keys(classe).forEach(key => {
      const exec = classe[key]
      if (typeof exec === "function") {
        obj[key] = exec(item, column, idxItem, idxColumn)
        return
      }

      obj[key] = exec
    })

    return obj
  }

  protected getStyle = (item: IItem, column: ITableColumn, idxItem: number, idxColumn: number, style?: { [key: string]: string | Function }) => {
    if (!style) return {}

    let obj: { [key: string]: string } = {}
    Object.keys(style).forEach(key => {
      const exec = style[key]
      if (typeof exec === "function") {
        obj[key] = exec(item, column, idxItem, idxColumn)
        return
      }

      obj[key] = exec
    })

    return obj
  }

  protected getLabelClass = (item: IItem, column: ITableColumn, idxItem: number, idxColumn: number, value?: string | number | boolean) => {
    const label = (Array.isArray(column?.labels) ? column?.labels : []).find(label => label.value == value)
    return this.getClass(item, column, idxItem, idxColumn, label?.class)
  }

  protected getLabelStyle = (item: IItem, column: ITableColumn, idxItem: number, idxColumn: number, value?: string | number | boolean) => {
    const label = (Array.isArray(column?.labels) ? column?.labels : []).find(label => label.value == value)
    return this.getStyle(item, column, idxItem, idxColumn, label?.styles)
  }

  protected getLabelValue = (column: ITableColumn, value?: string | number | boolean) => {
    return (Array.isArray(column?.labels) ? column?.labels : []).find(label => label.value == value)?.label || value
  }
}

function transformLiterals(literals?: ITableLiterals): ITableLiterals {
  return {
    all_items: literals?.all_items || "Todos os itens",
    table_settings: literals?.table_settings || "Configurações",
    clear_filters: {
      title: literals?.clear_filters.title || "Limpar Filtros",
      message: literals?.clear_filters.message || "Filtros limpos com sucesso",
    },
    search: {
      label: literals?.search.label || "Pesquisar",
      placeholder: literals?.search.placeholder || "Pesquisar registros",
    },
    actions: {
      refresh: literals?.actions?.refresh || "Recarregar",
      add: literals?.actions?.add || "Novo",
      edit: literals?.actions?.edit || "Editar",
      view: literals?.actions?.view || "Visualizar",
      delete: literals?.actions?.delete || "Deletar",
      more_actions: literals?.actions?.more_actions || "Mais Ações",
    },
  }
}

function transformSettings(settings?: ITableSettings): ITableSettings {
  return {
    selected: settings?.selected !== false,
    singleSelected: settings?.singleSelected === false,
  }
}
