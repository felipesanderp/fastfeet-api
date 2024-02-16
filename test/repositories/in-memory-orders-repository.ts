import dayjs from 'dayjs'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'

import {
  FindManyNearbyParams,
  GetDayDeliveredOrdersCount,
  GetMonthDeliveredOrdersCount,
  GetMonthReturnedOrdersCount,
} from '@/domain/order/application/repositories/@types/orders'
import { OrdersRepository } from '@/domain/order/application/repositories/orders-repository'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'

import { InMemoryOrderImagesRepository } from './in-memory-order-images-repository'
import { InMemoryCustomersRepository } from './in-memory-customers-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryCustomerAddressesRepository } from './in-memory-customer-addresses-repository'

import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private orderImagesRepository: InMemoryOrderImagesRepository,
    private imagesRepository: InMemoryImagesRepository,
    private customersRepository: InMemoryCustomersRepository,
    private customerAddressesRepository: InMemoryCustomerAddressesRepository,
  ) {}

  async getDayDeliveredOrdersCount(): Promise<GetDayDeliveredOrdersCount> {
    const today = new Date()
    const yesterday = dayjs(today).subtract(1, 'day').toDate()
    const startOfToday = dayjs(today).startOf('day').toDate()
    const endOfToday = dayjs(today).endOf('day').toDate()
    const startOfYesterday = dayjs(yesterday).startOf('day').toDate()
    const endOfYesterday = dayjs(yesterday).endOf('day').toDate()

    const orders = this.items.filter((order) => order.deliveredAt !== null)

    const todayOrders = orders.filter(
      (order) =>
        order.deliveredAt >= startOfToday && order.deliveredAt <= endOfToday,
    )

    const yesterdayOrders = orders.filter(
      (order) =>
        order.deliveredAt >= startOfYesterday &&
        order.deliveredAt <= endOfYesterday,
    )

    const todayOrdersCount = todayOrders.length
    const yesterdayOrdersCount = yesterdayOrders.length

    const diffFromYesterday =
      yesterdayOrdersCount && todayOrdersCount
        ? (todayOrdersCount / yesterdayOrdersCount) * 100
        : null

    return {
      todayOrders: todayOrdersCount ?? 0,
      diffFromYesterday: diffFromYesterday
        ? Number((diffFromYesterday - 100).toFixed(2))
        : 0,
    }
  }

  async getMonthDeliveredOrdersCount(): Promise<GetMonthDeliveredOrdersCount> {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfCurrentMonth = today.startOf('month').toDate()
    const endOfCurrentMonth = today.endOf('month').toDate()
    const startOfLastMonth = lastMonth.startOf('month').toDate()
    const endOfLastMonth = lastMonth.endOf('month').toDate()

    const orders = this.items.filter((order) => order.deliveredAt !== null)

    const currentMonthOrders = orders.filter(
      (order) =>
        order.deliveredAt >= startOfCurrentMonth &&
        order.deliveredAt <= endOfCurrentMonth,
    )

    const lastMonthOrders = orders.filter(
      (order) =>
        order.deliveredAt >= startOfLastMonth &&
        order.deliveredAt <= endOfLastMonth,
    )

    const currentMonthOrdersCount = currentMonthOrders.length
    const lastMonthOrdersCount = lastMonthOrders.length

    const diffFromLastMonth =
      lastMonthOrdersCount && currentMonthOrdersCount
        ? (currentMonthOrdersCount / lastMonthOrdersCount) * 100
        : null

    return {
      currentMonthOrdersCount: currentMonthOrdersCount ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  }

  async getPendingOrdersCount() {
    const pendingOrders = this.items
      .filter((order) => order.deliveredAt === null)
      .map((order) => {
        const customer = this.customersRepository.items.find((customer) =>
          customer.id.equals(order.customerId),
        )

        const address = this.customerAddressesRepository.items.find(
          (address) => {
            return address.customerId.equals(order.customerId)
          },
        )

        const orderImage = this.orderImagesRepository.items.find((orderImage) =>
          orderImage.orderId.equals(order.id),
        )

        const image = this.imagesRepository.items.find((image) =>
          orderImage?.imageId.equals(image.id),
        )

        return OrderDetails.create({
          orderId: order.id,
          image: image?.url,
          deliveredAt: order.deliveredAt,
          postedAt: order.postedAt,
          returnedAt: order.returnedAt,
          withdrawnAt: order.withdrawnAt,
          description: order.description,
          customerId: customer.id,
          customer: customer.name,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          cep: address.cep,
          latitude: address.latitude,
          longitude: address.longitude,
        })
      })

    return pendingOrders
  }

  async getMonthReturnedOrdersCount(): Promise<GetMonthReturnedOrdersCount> {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfCurrentMonth = today.startOf('month').toDate()
    const endOfCurrentMonth = today.endOf('month').toDate()
    const startOfLastMonth = lastMonth.startOf('month').toDate()
    const endOfLastMonth = lastMonth.endOf('month').toDate()

    const orders = this.items.filter((order) => order.returnedAt !== null)

    const currentMonthOrders = orders.filter(
      (order) =>
        order.returnedAt >= startOfCurrentMonth &&
        order.returnedAt <= endOfCurrentMonth,
    )

    const lastMonthOrders = orders.filter(
      (order) =>
        order.returnedAt >= startOfLastMonth &&
        order.returnedAt <= endOfLastMonth,
    )

    const currentMonthReturnedOrdersCount = currentMonthOrders.length
    const lastMonthReturnedOrdersCount = lastMonthOrders.length

    const diffFromLastMonth =
      lastMonthReturnedOrdersCount && currentMonthReturnedOrdersCount
        ? (currentMonthReturnedOrdersCount / lastMonthReturnedOrdersCount) * 100
        : null

    return {
      currentMonthReturnedOrdersCount: currentMonthReturnedOrdersCount ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.deliverymanId?.toString() === deliverymanId)
      .slice((page - 1) * perPage, page * perPage)

    return orders
  }

  async findManyByCustomerId(
    customerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.customerId.toString() === customerId)
      .slice((page - 1) * perPage, page * perPage)

    return orders
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 1

    const orders = this.items.filter((item) => {
      const customer = this.customersRepository.items.find((customer) =>
        customer.id.equals(item.customerId),
      )

      if (!customer) {
        throw new Error(
          `Customer with ID ${item.customerId.toString()} does not exist.`,
        )
      }

      const address = this.customerAddressesRepository.items.find((address) =>
        address.customerId.equals(customer.id),
      )

      if (!address) {
        throw new Error(`Customer address not found.`)
      }

      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: address.latitude,
          longitude: address.longitude,
        },
      )

      return distance < MAX_DISTANCE_IN_KILOMETERS
    })

    return orders
  }

  async findDetailsById(id: string): Promise<OrderDetails> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    const customer = this.customersRepository.items.find((customer) =>
      customer.id.equals(order.customerId),
    )

    if (!customer) {
      throw new Error(
        `Customer with ID ${order.customerId.toString()} does not exist.`,
      )
    }

    const address = this.customerAddressesRepository.items.find((address) =>
      address.customerId.equals(order.customerId),
    )

    if (!address) {
      throw new Error(
        `Address for customer ID ${order.customerId.toString()} does not exist.`,
      )
    }

    const orderImage = this.orderImagesRepository.items.find((orderImage) =>
      orderImage.orderId.equals(order.id),
    )

    const image = this.imagesRepository.items.find((image) =>
      orderImage?.imageId.equals(image.id),
    )

    return OrderDetails.create({
      orderId: order.id,
      image: image?.url,
      deliveredAt: order.deliveredAt,
      postedAt: order.postedAt,
      returnedAt: order.returnedAt,
      withdrawnAt: order.withdrawnAt,
      description: order.description,
      customerId: customer.id,
      customer: customer.name,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      cep: address.cep,
      latitude: address.latitude,
      longitude: address.longitude,
    })
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
