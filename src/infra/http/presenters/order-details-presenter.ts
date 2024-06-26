import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

export class OrderDetailsPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      orderId: orderDetails.orderId.toString(),
      description: orderDetails.description,
      image: orderDetails.image,
      postedAt: orderDetails.postedAt.toDateString(),
      withdrawnAt: orderDetails.withdrawnAt.toDateString(),
      deliveredAt: orderDetails.deliveredAt.toDateString(),
      returnedAt: orderDetails.returnedAt.toDateString(),
      customerId: orderDetails.customerId.toString(),
      customer: orderDetails.customer,
      street: orderDetails.street,
      number: orderDetails.number,
      neighborhood: orderDetails.neighborhood,
      city: orderDetails.city,
      cep: orderDetails.cep,
      latitude: orderDetails.latitude,
      longitude: orderDetails.longitude,
    }
  }
}
