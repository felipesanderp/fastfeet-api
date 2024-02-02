import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderReturnedEvent } from '@/domain/order/enterprise/events/order-returned'

export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.customerId.toString(),
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi marcada como devolvida.`,
    })
  }
}
