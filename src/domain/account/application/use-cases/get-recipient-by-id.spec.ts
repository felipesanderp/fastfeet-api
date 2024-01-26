import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-address-repository'
import { GetRecipientByIdUseCase } from './get-recipient-by-id'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository

let sut: GetRecipientByIdUseCase

describe('Get Recipient By Id', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    sut = new GetRecipientByIdUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get a recipient by id', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-id'))
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-id',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0].name).toEqual(recipient.name)
  })

  it('should not be able to get a non existing recipient', async () => {
    const result = await sut.execute({
      recipientId: 'non-existing-recipient-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
