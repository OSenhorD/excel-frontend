import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core"

import { FormControl, ReactiveFormsModule } from "@angular/forms"

import { debounceTime, distinctUntilChanged } from "rxjs"

export interface ISearchLiterals {
  label: string
  placeholder: string
}

@Component({
  selector: "custom-search",
  standalone: true,
  templateUrl: "./search.component.html",
  imports: [
    ReactiveFormsModule,
  ],
})

export class SearchComponent implements OnInit {
  @Input({ transform: transformLiterals }) literals: ISearchLiterals = {
    label: "Pesquisar",
    placeholder: "Pesquisar registros",
  }

  @Output("on-search") onSearchEvent = new EventEmitter<string>()

  search = new FormControl("", { nonNullable: true })

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((res) => this.onSearchEvent.emit(res))
  }
}

function transformLiterals(literals?: ISearchLiterals): ISearchLiterals {
  return {
    label: literals?.label || "Pesquisar",
    placeholder: literals?.placeholder || "Pesquisar registros",
  }
}
