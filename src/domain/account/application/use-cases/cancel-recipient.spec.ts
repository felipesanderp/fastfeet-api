import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CancelRecipientUseCase } from './cancel-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-addresses-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository

let sut: CancelRecipientUseCase

describe('Cancel Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    sut = new CancelRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to cancel a recipient', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-id'))
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].isActive).toBeFalsy()
    expect(inMemoryRecipientsRepository.items[0].cancelAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to cancel a non existing recipient', async () => {
    const result = await sut.execute({
      recipientId: 'non-existing-deliveryman-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
