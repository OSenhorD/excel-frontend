import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

import { MenuComponent } from "src/app/components/menu.component"

@Component({
  selector: "layout-default",
  standalone: true,
  imports: [
    RouterModule,
    MenuComponent,
  ],
  template: `
    <custom-menu></custom-menu>

    <div class="p-4 md:ml-64">
      <router-outlet></router-outlet>
    </div>
  `,
})

export class DefaultComponent {
}
