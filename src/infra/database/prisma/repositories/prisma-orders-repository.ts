import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'
import * as dayjs from 'dayjs'

import { PrismaService } from '../prisma.service'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'

import {
  FindManyNearbyParams,
  GetDayDeliveredOrdersCount,
  GetMonthDeliveredOrdersCount,
  GetMonthReturnedOrdersCount,
} from '@/domain/order/application/repositories/@types/orders'
import { Order } from '@/domain/order/enterprise/entities/order'
import { OrderDetails } from '@/domain/order/enterprise/entities/value-objects/order-details'
import { OrdersRepository } from '@/domain/order/application/repositories/orders-repository'

import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async getDayDeliveredOrdersCount(): Promise<GetDayDeliveredOrdersCount> {
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
        order.deliveredAt >= startOfCurrentMonth.toDate() &&
        order.deliveredAt <= endOfCurrentMonth.toDate(),
    )

    const lastMonthOrders = orders.filter(
      (order) =>
        order.deliveredAt >= startOfLastMonth.toDate() &&
        order.deliveredAt <= endOfLastMonth.toDate(),
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

  async getPendingOrdersCount(): Promise<OrderDetails[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        postedAt: {
          not: null,
        },
        AND: {
          deliveredAt: {
            in: null,
          },
        },
      },
      include: {
        recipient: {
          include: {
            address: true,
          },
        },
      },
    })

    return orders.map(PrismaOrderDetailsMapper.toDomain)
  }

  async getMonthReturnedOrdersCount(): Promise<GetMonthReturnedOrdersCount> {
    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfCurrentMonth = today.startOf('month')
    const endOfCurrentMonth = today.endOf('month')
    const startOfLastMonth = lastMonth.startOf('month')
    const endOfLastMonth = lastMonth.endOf('month')

    const orders = await this.prisma.order.findMany({
      where: {
        returnedAt: { not: null },
      },
    })

    const currentMonthOrders = orders.filter(
      (order) =>
        order.returnedAt >= startOfCurrentMonth.toDate() &&
        order.returnedAt <= endOfCurrentMonth.toDate(),
    )

    const lastMonthOrders = orders.filter(
      (order) =>
        order.returnedAt >= startOfLastMonth.toDate() &&
        order.returnedAt <= endOfLastMonth.toDate(),
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
