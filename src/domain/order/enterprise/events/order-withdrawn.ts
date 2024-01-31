import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class OrderWithdrawnEvent implements DomainEvent {
  ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.order = order
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
