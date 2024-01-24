import { InMemoryAdminRepository } from 'test/repositories/in-memory-admins-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { makeAdmin } from 'test/factories/make-admin'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

let inMemoryAdminsRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateAdminUseCase

describe('Authenticate Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a admin', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123.123.123-90'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryAdminsRepository.items.push(admin)

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
