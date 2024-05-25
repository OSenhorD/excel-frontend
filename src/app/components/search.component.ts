import { Component, Input } from "@angular/core"

import { FormControl, ReactiveFormsModule } from "@angular/forms"

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

export class SearchComponent {
  @Input({ transform: transformLiterals }) literals: ISearchLiterals = {
    label: "Pesquisar",
    placeholder: "Pesquisar registros",
  }

  @Input() search!: FormControl<string>
}

function transformLiterals(literals?: ISearchLiterals): ISearchLiterals {
  return {
    label: literals?.label || "Pesquisar",
    placeholder: literals?.placeholder || "Pesquisar registros",
  }
}
