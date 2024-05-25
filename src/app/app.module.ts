import { LOCALE_ID, NgModule } from "@angular/core"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { BrowserModule } from "@angular/platform-browser"
import { registerLocaleData } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import localeBr from "@angular/common/locales/pt"

import { AppComponent } from "src/app/app.component"
import { AlertComponent } from "src/app/components/alert.component"

import { TokenInterceptorService } from "src/app/interceptors/token-interceptor.service"
import { ErrorInterceptorService } from "src/app/interceptors/error-interceptor.service"

registerLocaleData(localeBr, "pt")

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/login" },
  {
    path: "login",
    loadComponent: () => import("src/app/authentication/login.component").then((c) => c.LoginComponent),
  },
  {
    path: "recovery",
    loadComponent: () => import("src/app/authentication/recovery.component").then((c) => c.RecoveryComponent),
  },
  {
    path: "new-password",
    loadComponent: () => import("src/app/authentication/new-password.component").then((c) => c.NewPasswordComponent),
  },
  {
    path: "",
    loadComponent: () => import("src/app/_layouts/default.component").then((c) => c.DefaultComponent),
    children: [
      {
        path: "home",
        loadComponent: () => import("src/app/pages/home/home.component").then((c) => c.HomeComponent),
      },
      {
        path: "perfil",
        loadComponent: () => import("src/app/pages/perfil/perfil.component").then((c) => c.PerfilComponent),
      },
      {
        path: "database",
        loadChildren: () => import("src/app/pages/database/database.module").then((m) => m.DatabaseModule),
      },
      {
        path: "security",
        loadChildren: () => import("src/app/pages/security/security.module").then((m) => m.SecurityModule),
      },
    ],
  },
  { path: "**", redirectTo: "/login" },
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AlertComponent,
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      enableViewTransitions: true,
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
