import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

const routes: Routes = [
  {
    path: "data",
    loadComponent: () => import("src/app/pages/database/data/data-list.component").then((m) => m.DataListComponent),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DatabaseModule { }
