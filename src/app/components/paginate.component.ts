import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core"

interface IPaginateLiterals {
  showing: string
}

@Component({
  selector: "custom-paginate",
  standalone: true,
  templateUrl: "./paginate.component.html",
})

export class PaginateComponent implements AfterViewInit {
  @Input() page: number = 0
  @Input("page-size") pageSize: number = 15
  @Input("count-total-items") countTotalItems: number = 0

  @Input() showPages: number = 6

  @Output("on-page-set") protected readonly onPageSetEvent = new EventEmitter<number>()

  protected literals: IPaginateLiterals = {
    showing: "Mostrando",
  }

  protected pages: string[] = []

  ngAfterViewInit(): void {
    this._buildPages()
  }

  protected pageIsActive = (page: string): boolean => page != "..." && Number(page) == this.page + 1

  private _pageLast = (): number => Math.ceil(this.countTotalItems / this.pageSize)

  protected pagePrevious = () => {
    this.page = this.page == 0 ? this._pageLast() - 1 : this.page - 1
    this._buildPages()
    this.onPageSetEvent.emit(this.page)
  }

  protected pageNext = (): void => {
    this.page = this.page + 1 >= this._pageLast() ? 0 : this.page + 1
    this._buildPages()
    this.onPageSetEvent.emit(this.page)
  }

  protected pageSet = (page: string): void => {
    if (page == "..." || Number(page) == this.page + 1) return
    this.page = Number(page) - 1
    this._buildPages()
    this.onPageSetEvent.emit(this.page)
  }

  private _buildPages = (): void => {
    if (this.countTotalItems > this.showPages * this.pageSize) {
      if (this.page >= 2) {
        if (this.page <= this._pageLast() - (this.showPages - 3) - 2) {
          this.pages = [
            "1", "...", ...new Array(this.showPages - 4).fill("").map((_, idx) => `${this.page + idx + 1}`), "...", `${this._pageLast()}`
          ]
          return
        }

        this.pages = [
          "1", "...", ...new Array(this.showPages - 2).fill("").map((_, idx) => `${this._pageLast() - idx}`).reverse()
        ]
        return
      }

      this.pages = [
        ...new Array(this.showPages - 2).fill("").map((_, idx) => `${idx + 1}`), "...", `${this._pageLast()}`,
      ]
      return
    }

    this.pages = new Array(this._pageLast()).fill("").map((_, idx) => `${idx + 1}`)
  }
}
