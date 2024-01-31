import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/order/application/repositories/orders-repository'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async findDetailsById(id: string): Promise<OrderDetails> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Order> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = order

      if (order.image) {
        await this.orderImagesRepository.create(order.image)
      }

      DomainEvents.dispatchEventsForAggregate(order.id)
    }
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
      this.orderImagesRepository.deleteByOrderId(order.id.toString())
    }
  }
}
