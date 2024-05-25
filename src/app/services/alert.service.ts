import { Injectable } from "@angular/core"

import { Subject } from "rxjs"

import { environment } from "src/environments/environment"

import { INotification } from "src/app/interfaces/shared/shared"

@Injectable({
  providedIn: "root",
})

export class AlertService {
  private readonly _alertSubject = new Subject<INotification>()
  private readonly _duration: number = environment?.notificationDuration || 5000

  get alerts() {
    return this._alertSubject.asObservable()
  }

  success = (title: string = "", message: string = "", duration: number = this._duration): void => {
    this._alertSubject.next({ title, message, duration, type: "success" })
  }

  error = (title: string = "", message: string = "", duration: number = this._duration): void => {
    this._alertSubject.next({ title, message, duration, type: "danger" })
  }

  warning = (title: string = "", message: string = "", duration: number = this._duration): void => {
    this._alertSubject.next({ title, message, duration, type: "warning" })
  }

  info = (title: string = "", message: string = "", duration: number = this._duration): void => {
    this._alertSubject.next({ title, message, duration, type: "info" })
  }
}
