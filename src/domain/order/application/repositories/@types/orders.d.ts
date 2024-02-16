import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export type GetDayDeliveredOrdersCount = {
  todayOrders: number
  diffFromYesterday: number
}

export type GetPendingOrdersCount = {
  pendingOrders: OrderDetails[]
}

export type GetMonthDeliveredOrdersCount = {
  currentMonthOrdersCount: number
  diffFromLastMonth: number
}

export type GetMonthReturnedOrdersCount = {
  currentMonthReturnedOrdersCount: number
  diffFromLastMonth: number
}
