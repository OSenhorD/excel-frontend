import { CommonModule } from "@angular/common"

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from "@angular/core"

import { Subscription } from "rxjs"

import { DropdownComponent } from "src/app/components/dropdown.component"

import { RestService } from "src/app/services/rest.service"

interface IDistinct {
  value: string
  $selected?: boolean
}

@Component({
  selector: "custom-filter",
  standalone: true,
  templateUrl: "./filter.component.html",
  imports: [
    CommonModule,
    DropdownComponent,
  ],
})

export class FilterComponent implements OnDestroy {
  private readonly _restService: RestService = inject(RestService)

  @Input() label: string = ""
  @Input({ required: true }) column: string = ""
  @Input({ required: true }) api: string = ""

  @Output("on-filter") onFilterEvent = new EventEmitter()

  private readonly _subscriptions = new Subscription()

  protected distinct: IDistinct[] = []

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  protected onOpenDropdown = () => {
    this._getDistinct()
  }

  protected onSelectFilter = (item: IDistinct) => {
    item.$selected = !item.$selected

    const values = this.distinct.filter(item => item.$selected).map(item => item.value)
    localStorage.setItem(`@excel:filter:${this.column}`, values.join(";;;"))
  }

  protected getWidth = () => {
    const values = this.distinct.map(item => (item?.value || "").length)
    const max = Math.max(...values)
    return `${(max * 7) + 75}px`
  }

  private _getDistinct = () => {
    this._subscriptions.add(
      this._restService
        .get(`/${this.api}/distinct/${this.column}`)
        .subscribe({
          next: (res: any) => {
            const valuesStorage = (localStorage.getItem(`@excel:filter:${this.column}`) || "").split(";;;")

            const items: string[] = Array.isArray(res.data) ? res.data : []
            this.distinct = items.map(item => ({ value: item, $selected: valuesStorage.includes(item) }))
          },
          error: (error: Error) => console.error(error),
        })
    )
  }
}
