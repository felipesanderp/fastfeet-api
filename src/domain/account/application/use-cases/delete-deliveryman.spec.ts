import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: DeleteDeliverymanUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()

    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non existing deliveryman', async () => {
    const result = await sut.execute({
      deliverymanId: 'non-existing-deliveryman-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
