import { inject, Injectable } from "@angular/core"
import { NavigationExtras, Router } from "@angular/router"

import { IParams } from "src/app/interfaces/shared/shared"

@Injectable({
  providedIn: "root",
})

export class PageService {
  private readonly _router: Router = inject(Router)

  get pageType() {
    const urls = this._router.url.split("?")[0].split("/")
    const url = ["new", "edit", "view"].includes(urls[urls.length - 1]) ? urls[urls.length - 1] : urls[urls.length - 2]
    const type = ["new", "edit", "view"].includes(url) ? url : "view"
    return type as "new" | "edit" | "view"
  }

  get queryParams() {
    return this._router.routerState.snapshot.root.queryParams
  }

  createUrl = (route: string, page: number, pageSize: number, search?: string, customParams?: IParams) => {
    const params = this._createParamsUrl(page, pageSize, search, customParams)
    return route.startsWith("http") ? `${route}${params}` : `/${route}${params}`
  }

  goTo = (route: string, extras?: NavigationExtras) => {
    this._router.navigate([`/${route}`], { skipLocationChange: true, ...extras })
  }

  back = (extras?: NavigationExtras) => {
    const url = this._router.url.split("/")
    url.pop()

    if (url.length > 0 && ["new", "edit", "view"].includes(url[url.length - 1])) {
      url.pop()
    }

    this._router.navigate(url, { skipLocationChange: true, ...extras })
  }

  private _createParamsUrl = (page: number, pageSize: number, search?: string, customParams?: IParams) => {
    const params = customParams || {}
    const newParams = Object.keys(params)
      .filter(key => params[key] !== undefined)
      .map(key => `${key}=${params[key] || ""}`)
      .join("&")

    let url = ""
    url += `?page=${page}`
    url += `&pageSize=${pageSize}`
    url += `${search ? `&search=${search}` : ""}`
    url += `${newParams ? `&${newParams}` : ""}`
    return url
  }
}
