import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCustomer } from 'test/factories/make-customer'
import { makeCustomerAddress } from 'test/factories/make-customer-address'
import { GetMonthDeliveredOrdersCountUseCase } from './get-month-delivered-orders-count'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: GetMonthDeliveredOrdersCountUseCase

describe('Get Month Delivered Orders', () => {
  beforeEach(() => {
    inMemoryCustomerAddressesRepository =
      new InMemoryCustomerAddressesRepository()
    inMemoryCustomersRepository = new InMemoryCustomersRepository()
    inMemoryOrderImagesRepository = new InMemoryOrderImagesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderImagesRepository,
      inMemoryImagesRepository,
      inMemoryCustomersRepository,
      inMemoryCustomerAddressesRepository,
    )

    sut = new GetMonthDeliveredOrdersCountUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get month delivered orders', async () => {
    const customer = makeCustomer({ name: 'John Doe' })
    inMemoryCustomersRepository.items.push(customer)

    const customerAddress = makeCustomerAddress({
      customerId: customer.id,
      cep: '12345-000',
    })

    inMemoryCustomerAddressesRepository.items.push(customerAddress)

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 01',
          postedAt: new Date('2024-02-16T12:00:00'),
          withdrawnAt: new Date('2024-02-16T13:00:00'),
          deliveredAt: new Date('2024-02-16T14:00:00'),
        },
        new UniqueEntityID('order-1'),
      ),
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 02',
          postedAt: new Date('2024-02-16T09:00:00'),
          withdrawnAt: new Date('2024-02-16T09:20:00'),
          deliveredAt: new Date('2024-02-16T10:41:00'),
        },
        new UniqueEntityID('order-2'),
      ),
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 03',
          postedAt: new Date('2024-01-15T12:00:00'),
          withdrawnAt: new Date('2024-01-15T13:00:00'),
          deliveredAt: new Date('2024-01-15T14:00:00'),
        },
        new UniqueEntityID('order-3'),
      ),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.orders.currentMonthOrdersCount).toEqual(2)
    expect(result.value.orders.diffFromLastMonth).toEqual(100)
  })
})