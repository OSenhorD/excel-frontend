import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

const routes: Routes = [
  {
    path: "data",
    loadComponent: () => import("src/app/pages/database/data/data-list.component").then((m) => m.DataListComponent),
  },
  {
    path: "excel",
    loadComponent: () => import("src/app/pages/database/excel/excel.component").then((m) => m.ExcelComponent),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DatabaseModule { }
