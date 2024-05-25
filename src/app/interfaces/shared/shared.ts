export type IParams = { [key: string]: string | number | boolean | null | undefined }

enum NotificationType {
  success = "success",
  danger = "danger",
  warning = "warning",
  info = "info",
}
export type INotificationType = keyof typeof NotificationType

export interface INotification {
  id?: string
  title: string
  message: string
  type: INotificationType
  duration: number
}

export interface IItem {
  id: string
  $selected?: boolean
  [key: string]: any
}
