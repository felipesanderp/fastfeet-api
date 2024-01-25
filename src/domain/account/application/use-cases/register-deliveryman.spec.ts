import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { RegisterDeliverymanUseCase } from './register-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliverymanUseCase

describe('Register Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })

  it('should be able to register a deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '100.398.987-98',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should hash deliveryman password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '100.398.987-98',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to create a deliveryman with same CPF', async () => {
    inMemoryDeliverymanRepository.items.push(
      makeDeliveryman({
        cpf: CPF.create('100.398.987-98'),
      }),
    )

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '100.398.987-98',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError)
  })
})
