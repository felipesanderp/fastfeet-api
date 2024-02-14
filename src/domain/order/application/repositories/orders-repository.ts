import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export type GetDayOrdersCount = {
  todayOrders: number
  diffFromYesterday: number
}

export type GetMonthOrdersCount = {
  currentMonthOrdersCount: number
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

  abstract getDayOrdersCount(): Promise<GetDayOrdersCount>
  abstract getMonthOrdersCount(): Promise<GetMonthOrdersCount>

  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  abstract findDetailsById(id: string): Promise<OrderDetails | null>
  abstract findById(id: string): Promise<Order | null>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
