import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteRecipientUseCase } from './delete-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeRecipientAddress } from 'test/factories/make-recipient-address'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository

let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-1'))
    const address = makeRecipientAddress({
      recipientId: recipient.id,
      latitude: -19.9025359,
      longitude: -44.0464511,
    })

    recipient.address = address

    inMemoryRecipientsRepository.items.push(recipient)
    inMemoryRecipientAddressesRepository.items.push(address)

    const result = await sut.execute({
      recipientId: 'recipient-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
    expect(inMemoryRecipientAddressesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non existing recipient', async () => {
    const result = await sut.execute({
      recipientId: 'non-existing-recipient-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
