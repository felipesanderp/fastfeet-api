import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

import {
  FindManyNearbyParams,
  GetDayDeliveredOrdersCount,
  GetMonthDeliveredOrdersCount,
  GetMonthReturnedOrdersCount,
  GetPendingOrdersCount,
} from './@types/orders'

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
