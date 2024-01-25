import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateDeliverymanProfileUseCase } from './update-deliveryman-profile'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: UpdateDeliverymanProfileUseCase

describe('Update Deliveryman Profile', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()

    sut = new UpdateDeliverymanProfileUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to update a deliveryman profile', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      name: 'deliveryman-new-name',
      cpf: '123.123.123-90',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'deliveryman-new-name',
        cpf: CPF.create('123.123.123-90'),
      }),
    )
  })

  it('should not be able to update a non existing deliveryman', async () => {
    const result = await sut.execute({
      deliverymanId: 'non-existing-deliveryman-id',
      name: 'fake-name',
      cpf: '123.123.123-90',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
