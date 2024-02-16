import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CancelDeliverymanUseCase } from './cancel-deliveryman'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: CancelDeliverymanUseCase

describe('Cancel Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()

    sut = new CancelDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to cancel a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].isActive).toBeFalsy()
    expect(inMemoryDeliverymanRepository.items[0].cancelAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to cancel a non existing deliveryman', async () => {
    const result = await sut.execute({
      deliverymanId: 'non-existing-deliveryman-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
