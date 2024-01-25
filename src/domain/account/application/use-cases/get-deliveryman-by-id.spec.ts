import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetDeliverymanByIdUseCase } from './get-deliveryman-by-id'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: GetDeliverymanByIdUseCase

describe('Get Deliveryman By Id', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()

    sut = new GetDeliverymanByIdUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to get a deliveryman by id', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].name).toEqual(
      deliveryman.name,
    )
  })

  it('should not be able to get a non existing deliveryman', async () => {
    const result = await sut.execute({
      deliverymanId: 'non-existing-deliveryman-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
