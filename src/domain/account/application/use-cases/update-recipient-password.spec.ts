import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SamePasswordError } from './errors/same-password-error'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UpdateRecipientPasswordUseCase } from './update-recipient-password'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-address-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository
let fakeHasher: FakeHasher

let sut: UpdateRecipientPasswordUseCase

describe('Update Deliveryman Password', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )
    fakeHasher = new FakeHasher()

    sut = new UpdateRecipientPasswordUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
    )
  })

  it('should be able to update a recipient password', async () => {
    const recipient = makeRecipient(
      {
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityID('recipient-id'),
    )
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-id',
      newPassword: '12345678910',
    })

    const hashedNewPassword = await fakeHasher.hash('12345678910')

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      hashedNewPassword,
    )
  })

  it('should not be able to update deliveryman password with same old password', async () => {
    const recipient = makeRecipient(
      {
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityID('recipient-id'),
    )
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-id',
      newPassword: await fakeHasher.hash('123456'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePasswordError)
  })
})
