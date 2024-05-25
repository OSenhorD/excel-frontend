import {
  Component,
  inject,
  OnDestroy,
} from "@angular/core"

import { CommonModule } from "@angular/common"

import { Subscription } from "rxjs"

import { v4 as uuidv4 } from "uuid"

import { INotification } from "src/app/interfaces/shared/shared"
import { AlertService } from "src/app/services/alert.service"

@Component({
  selector: "custom-alert",
  standalone: true,
  templateUrl: "./alert.component.html",
  imports: [
    CommonModule,
  ],
})

export class AlertComponent implements OnDestroy {
  private readonly _alertService: AlertService = inject(AlertService)

  private _alerts: Omit<INotification, "duration">[] = []
  private readonly _subscription: Subscription = this._alertService.alerts.subscribe(alert => this._defineAlerts(alert))

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

  protected get alerts(): Omit<INotification, "duration">[] {
    return this._alerts
  }

  protected exit = (id?: string): void => {
    this._alerts = this._alerts.filter(item => item.id != id)
  }

  protected getClassButton = (alert: Omit<INotification, "duration">) => {
    const colors = {
      success: "green",
      danger: "red",
      warning: "yellow",
      info: "gray",
    }
    const color = colors[alert.type] || "gray"
    return `text-${color}-400 hover:text-${color}-900 focus:ring-${color}-300 hover:bg-${color}-100 dark:text-${color}-500`
  }

  private _defineAlerts = (alert: INotification): void => {
    const id = uuidv4()

    this._alerts.push({
      id,
      type: alert?.type || "info",
      title: alert?.title || "",
      message: alert?.message || "",
    })

    setTimeout(() => this.exit(id), alert?.duration || 3000)
  }
}
