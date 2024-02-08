import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UpdateDeliverymanPasswordUseCase } from './update-deliveryman-password'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SamePasswordError } from './errors/same-password-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher

let sut: UpdateDeliverymanPasswordUseCase

describe('Update Deliveryman Password', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()

    sut = new UpdateDeliverymanPasswordUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })

  it('should be able to update a deliveryman password', async () => {
    const deliveryman = makeDeliveryman(
      {
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      newPassword: '12345678910',
    })

    const hashedNewPassword = await fakeHasher.hash('12345678910')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      hashedNewPassword,
    )
  })

  it('should not be able to update deliveryman password with same old password', async () => {
    const deliveryman = makeDeliveryman(
      {
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityID('deliveryman-id'),
    )
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      newPassword: await fakeHasher.hash('123456'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePasswordError)
  })
})
