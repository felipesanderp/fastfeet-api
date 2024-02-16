export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export type GetDayDeliveredOrdersCount = {
  todayOrders: number
  diffFromYesterday: number
}

export type GetPendingOrdersCount = {
  pendingOrders: {
    id: string
    postedAt: Date
    withdrawnAt: Date
    deliveredAt: Date
    recipient: {
      id: string
      address: {
        latitude: Prisma.Decimal
        longitude: Prisma.Decimal
      }
    }
  }[]
}

export type GetMonthDeliveredOrdersCount = {
  currentMonthOrdersCount: number
  diffFromLastMonth: number
}

export type GetMonthReturnedOrdersCount = {
  currentMonthReturnedOrdersCount: number
  diffFromLastMonth: number
}
