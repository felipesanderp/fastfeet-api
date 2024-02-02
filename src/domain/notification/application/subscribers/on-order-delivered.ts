import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderDeliveredEvent } from '@/domain/order/enterprise/events/order-delivered'

export class OnOrderDelivered implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPostedNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderPostedNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotification.execute({
      recipientId: order.customerId.toString(),
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi marcada como entregue.`,
    })
  }
}
