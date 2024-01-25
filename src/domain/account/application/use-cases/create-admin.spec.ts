import { InMemoryAdminRepository } from 'test/repositories/in-memory-admins-repository'
import { CreateAdminUseCase } from './create-admin'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { makeAdmin } from 'test/factories/make-admin'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'

let inMemoryAdminsRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher

let sut: CreateAdminUseCase

describe('Create Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to create a admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '100.398.987-98',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should hash admin password upon registration', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123.123.123-99'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryAdminsRepository.items.push(admin)

    const hashedPassword = await fakeHasher.hash('123456')

    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a admin with same CPF', async () => {
    inMemoryAdminsRepository.items.push(
      makeAdmin({
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
