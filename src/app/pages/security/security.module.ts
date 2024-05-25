import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

const routes: Routes = [
  {
    path: "users",
    loadChildren: () => import("src/app/pages/security/users/users.module").then((m) => m.UsersModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SecurityModule { }
