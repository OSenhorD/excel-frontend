export type HttpResponse<T = any, V = any> = {
  statusCode: number
  data: T
  error?: V
}

export type HttpResponseList<T = any[], V = any> = {
  statusCode: number
  items: T
  error?: V
  count?: number
}
