import { InMemoryCustomerAddressesRepository } from 'test/repositories/in-memory-customer-addresses-repository'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryOrderImagesRepository } from 'test/repositories/in-memory-order-images-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCustomer } from 'test/factories/make-customer'
import { makeCustomerAddress } from 'test/factories/make-customer-address'

import { GetMonthReturnedOrdersCountUseCase } from './get-month-returned-orders-count'

let inMemoryCustomerAddressesRepository: InMemoryCustomerAddressesRepository
let inMemoryCustomersRepository: InMemoryCustomersRepository
let inMemoryOrderImagesRepository: InMemoryOrderImagesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: GetMonthReturnedOrdersCountUseCase

describe('Get Month Returned Orders', () => {
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

    sut = new GetMonthReturnedOrdersCountUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get month returned orders', async () => {
    const customer = makeCustomer({ name: 'John Doe' })
    inMemoryCustomersRepository.items.push(customer)

    const customerAddress = makeCustomerAddress({
      customerId: customer.id,
      cep: '12345-000',
    })

    inMemoryCustomerAddressesRepository.items.push(customerAddress)

    const today = new Date()
    const dayWithLastMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 01',
          postedAt: today,
          withdrawnAt: today,
          deliveredAt: today,
          returnedAt: today,
        },
        new UniqueEntityID('order-1'),
      ),
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 02',
          postedAt: today,
          withdrawnAt: today,
          deliveredAt: today,
          returnedAt: today,
        },
        new UniqueEntityID('order-2'),
      ),
      makeOrder(
        {
          customerId: customer.id,
          description: 'Package 03',
          postedAt: dayWithLastMonth,
          withdrawnAt: dayWithLastMonth,
          deliveredAt: dayWithLastMonth,
          returnedAt: dayWithLastMonth,
        },
        new UniqueEntityID('order-3'),
      ),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value?.orders.currentMonthReturnedOrdersCount).toEqual(2)
    expect(result.value?.orders.diffFromLastMonth).toEqual(100)
  })
})
