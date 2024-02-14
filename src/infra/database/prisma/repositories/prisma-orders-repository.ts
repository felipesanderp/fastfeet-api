import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  FindManyNearbyParams,
  GetDayOrdersCount,
  GetMonthOrdersCount,
  OrdersRepository,
} from '@/domain/order/application/repositories/orders-repository'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'
import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'

import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'
import * as dayjs from 'dayjs'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async getDayOrdersCount(): Promise<GetDayOrdersCount> {
    const today = new Date()
    const yesterday = dayjs(today).subtract(1, 'day').toDate()
    const startOfToday = dayjs(today).startOf('day').toDate()
    const endOfToday = dayjs(today).endOf('day').toDate()
    const startOfYesterday = dayjs(yesterday).startOf('day').toDate()
    const endOfYesterday = dayjs(yesterday).endOf('day').toDate()

    const orders = await this.prisma.order.findMany({
      where: {
        deliveredAt: { not: null },
      },
    })

    const todayOrders = orders.filter(
      (order) =>
        order.createdAt >= startOfToday && order.createdAt <= endOfToday,
    )

    const yesterdayOrders = orders.filter(
      (order) =>
        order.createdAt >= startOfYesterday &&
        order.createdAt <= endOfYesterday,
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

  async getMonthOrdersCount(): Promise<GetMonthOrdersCount> {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfCurrentMonth = today.startOf('month')
    const endOfCurrentMonth = today.endOf('month')
    const startOfLastMonth = lastMonth.startOf('month')
    const endOfLastMonth = lastMonth.endOf('month')

    const orders = await this.prisma.order.findMany({
      where: {
        deliveredAt: { not: null },
      },
    })

    const currentMonthOrders = orders.filter(
      (order) =>
        order.createdAt >= startOfCurrentMonth.toDate() &&
        order.createdAt <= endOfCurrentMonth.toDate(),
    )

    const lastMonthOrders = orders.filter(
      (order) =>
        order.createdAt >= startOfLastMonth.toDate() &&
        order.createdAt <= endOfLastMonth.toDate(),
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

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByCustomerId(
    customerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        recipientId: customerId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * FROM orders
        JOIN users ON users.id = orders.recipient_id
        JOIN addresses ON addresses.recipient_id = users.id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        recipient: {
          include: {
            address: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderDetailsMapper.toDomain(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    })
  }
}
