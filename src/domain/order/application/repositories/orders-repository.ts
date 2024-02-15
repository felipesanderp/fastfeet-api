import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'
import { Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export type GetDayDeliveredOrdersCount = {
  todayOrders: number
  diffFromYesterday: number
}

export type GetPendingOrdersCount = {
  pendingOrders: {
    id: string
    postedAt: Date
    withdrawnAt: Date
    deliveredAt: Date
    recipient: {
      id: string
      address: {
        latitude: Prisma.Decimal
        longitude: Prisma.Decimal
      }
    }
  }[]
}

export type GetMonthDeliveredOrdersCount = {
  currentMonthOrdersCount: number
  diffFromLastMonth: number
}

export type GetMonthReturnedOrdersCount = {
  currentMonthReturnedOrdersCount: number
  diffFromLastMonth: number
}

export abstract class OrdersRepository {
  abstract findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract getDayDeliveredOrdersCount(): Promise<GetDayDeliveredOrdersCount>
  abstract getMonthDeliveredOrdersCount(): Promise<GetMonthDeliveredOrdersCount>
  abstract getPendingOrdersCount(): Promise<GetPendingOrdersCount>
  abstract getMonthReturnedOrdersCount(): Promise<GetMonthReturnedOrdersCount>

  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  abstract findDetailsById(id: string): Promise<OrderDetails | null>
  abstract findById(id: string): Promise<Order | null>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
