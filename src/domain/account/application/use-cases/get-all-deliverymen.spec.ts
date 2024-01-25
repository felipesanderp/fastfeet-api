import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetAllDeliverymenUseCase } from './get-all-deliverymen'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: GetAllDeliverymenUseCase

describe('Get All Deliverymen', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()

    sut = new GetAllDeliverymenUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to get all deliverymen', async () => {
    const deliveryman1 = makeDeliveryman(
      { name: 'deliveryman-1' },
      new UniqueEntityID('deliveryman-1-id'),
    )

    const deliveryman2 = makeDeliveryman(
      { name: 'deliveryman-2' },
      new UniqueEntityID('deliveryman-2-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman1, deliveryman2)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items).toHaveLength(2)
    expect(inMemoryDeliverymanRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'deliveryman-1',
        }),
        expect.objectContaining({
          name: 'deliveryman-2',
        }),
      ]),
    )
  })
})
