import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { AuthenticateRecipientUseCase } from './authenticate-recipient'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-address-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateRecipientUseCase

describe('Authenticate Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateRecipientUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a recipient', async () => {
    const recipient = makeRecipient({
      cpf: CPF.create('123.123.123-90'),
      password: await fakeHasher.hash('123456'),
    })
    inMemoryRecipientsRepository.items.push(recipient)

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
