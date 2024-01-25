import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateDeliverymanUseCase } from './authenticate-deliveryman'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDeliverymanUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: CPF.create('123.123.123-90'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '123.123.123-90',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
