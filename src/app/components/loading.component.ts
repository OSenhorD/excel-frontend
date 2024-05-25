import { Component, Input } from "@angular/core"

import { CommonModule } from "@angular/common"

@Component({
  selector: "custom-loading",
  standalone: true,
  templateUrl: "./loading.component.html",
  imports: [
    CommonModule,
  ],
})

export class LoadingComponent {
  @Input("is-loading") isLoading: boolean = false
}
