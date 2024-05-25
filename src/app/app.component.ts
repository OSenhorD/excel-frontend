import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>

    <custom-alert class="fixed z-50 top-1 right-1"></custom-alert>
`,
})

export class AppComponent { }
