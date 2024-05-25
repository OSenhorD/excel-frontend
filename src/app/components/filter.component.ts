import { CommonModule } from "@angular/common"

import {
  Component,
  inject,
  Input,
  OnDestroy,
} from "@angular/core"

import { Subscription } from "rxjs"

import { DropdownComponent } from "src/app/components/dropdown.component"

import { RestService } from "src/app/services/rest.service"

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

  private readonly _subscriptions = new Subscription()

  protected distinct: { value: string, $selected?: boolean }[] = []

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  protected onOpenDropdown = () => {
    this._getDistinct()
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
            const items: string[] = Array.isArray(res.data) ? res.data : []
            this.distinct = items.map(item => ({ value: item }))
          },
          error: (error: Error) => console.error(error),
        })
    )
  }
}
