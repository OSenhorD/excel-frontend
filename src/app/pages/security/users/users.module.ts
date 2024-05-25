import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("src/app/pages/security/users/user-list/user-list.component").then((c) => c.UserListComponent),
  },
  {
    path: "new",
    loadComponent: () => import("src/app/pages/security/users/user-edit/user-edit.component").then((c) => c.UserEditComponent),
  },
  {
    path: "new/:id",
    loadComponent: () => import("src/app/pages/security/users/user-edit/user-edit.component").then((c) => c.UserEditComponent),
  },
  {
    path: "edit/:id",
    loadComponent: () => import("src/app/pages/security/users/user-edit/user-edit.component").then((c) => c.UserEditComponent),
  },
  {
    path: "view/:id",
    loadComponent: () => import("src/app/pages/security/users/user-edit/user-edit.component").then((c) => c.UserEditComponent),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class UsersModule { }
