import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'
import { RegisterRecipientUseCase } from './register-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-address-repository'
import { FakeLocation } from 'test/services/fake-locations'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let fakeHasher: FakeHasher
let fakeLocation: FakeLocation

let sut: RegisterRecipientUseCase

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )
    fakeHasher = new FakeHasher()
    fakeLocation = new FakeLocation()

    sut = new RegisterRecipientUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeLocation,
    )
  })

  it('should be able to register a recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '100.398.987-98',
      password: '123456',
      cep: '12345-000',
      street: 'Center mall',
      number: 1,
      neighborhood: 'Center',
      city: 'city of angels',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should hashed recipient password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-01',
      password: '123456',
      cep: '12345-000',
      street: 'Center street',
      number: 1,
      neighborhood: 'Center',
      city: 'City 01',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should persist address when creating a new recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-01',
      password: '123456',
      cep: '12345-000',
      street: 'Center street',
      number: 1,
      neighborhood: 'Center',
      city: 'City 01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientAddressesRepository.items).toHaveLength(1)
    expect(inMemoryRecipientAddressesRepository.items[0]).toEqual(
      expect.objectContaining({
        cep: '12345-000',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    )
  })

  it('should not be able to create an existing recipient', async () => {
    inMemoryRecipientsRepository.items.push(
      makeRecipient({
        name: 'John Doe',
        cpf: CPF.create('123.123.123-00'),
        password: '123456',
      }),
    )

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.123.123-00',
      password: '123456',
      cep: '12345-000',
      street: 'Center street',
      number: 1,
      neighborhood: 'Center',
      city: 'City 01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError)
  })
})
